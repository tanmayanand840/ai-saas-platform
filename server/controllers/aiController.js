import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import FormData from "form-data";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MISTRAL_MODEL = "mistralai/mistral-7b-instruct:free";

// Helper function to call Mistral AI via OpenRouter
const callMistralAI = async (prompt, max_tokens = 1024, temperature = 0.7) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: MISTRAL_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: Math.min(max_tokens, 1024),
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
    }
  );

  return response.data.choices[0].message.content;
};

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const content = await callMistralAI(prompt, length);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type) 
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    let content = await callMistralAI(prompt, 300);

    // 🧹 Clean unwanted tokens like <s> [OUT] ... [/OUT]
    content = content
      .replace(/<s>\s*\[OUT\]\s*/gi, "") // remove starting tokens
      .replace(/\s*\[\/OUT\]\s*<\/s>/gi, "") // remove closing tokens
      .replace(/<\/?s>/gi, "") // remove stray <s> or </s>
      .replace(/\[OUT\]/gi, "") // remove [OUT] if alone
      .replace(/\[\/OUT\]/gi, "") // remove [/OUT] if alone
      .trim();

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')
    `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);
    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
    `;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;

    if (!resume) {
      console.error("❌ No file received");
      return res.json({ success: false, message: "No file uploaded." });
    }

    console.log("✅ File received:", resume.path);

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `
    Review this resume and provide professional, actionable feedback.
    Identify key strengths, weaknesses, missing information, formatting issues, and improvement suggestions.
    Resume content:
    ${pdfData.text}
    `;

    console.log("🧠 Sending prompt to Mistral AI...");
    const content = await callMistralAI(prompt, 1000);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'AI Resume Review', ${content}, 'resume-review')
    `;

    console.log("✅ Resume review completed successfully");
    res.json({ success: true, content });
  } catch (error) {
    console.error(
      "❌ Resume review failed:",
      error.response?.data || error.message
    );
    res.json({ success: false, message: "Failed to analyze resume." });
  }
};
