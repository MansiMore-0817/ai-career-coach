import OpenAI from "openai";
import ResumeAnalysis from "../models/ResumeAnalysis.model.js";
import JDResumeAnalysis from "../models/JDResumeAnalysis.model.js";
import { extractTextFromFile } from "../utils/extractText.js";

export const analyzeResume = async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const studentId = req.user.userId;
    const { resumeText } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: "Resume text is too short or empty",
      });
    }

    const prompt = `
You are a professional career coach.

Analyze the following resume and give:
1. Overall feedback
2. Strengths
3. Weaknesses
4. Specific improvements

Resume:
${resumeText}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert resume reviewer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });

    const aiFeedback = response.choices[0].message.content;

    // ✅ SAVE TO DB
    const savedAnalysis = await ResumeAnalysis.create({
      student: studentId,
      resumeText,
      aiFeedback,
    });

    res.status(201).json(savedAnalysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "AI resume analysis failed",
    });
  }
};

export const getResumeHistory = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const history = await ResumeAnalysis.find({
      student: studentId,
    }).sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Job description based resume analysis
export const analyzeResumeWithJD = async (req, res) => {
  try {
    const { resumeText, jobDescription, role, companyName } = req.body;

    // Basic validation
    if (!resumeText || !jobDescription || !role) {
      return res.status(400).json({
        message: "resumeText, jobDescription, and role are required",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
You are an Applicant Tracking System (ATS) and a senior technical recruiter.

Compare the given resume against the job description for the specified role.

Respond STRICTLY in valid JSON with the following structure:

{
  "atsScore": number between 0 and 100,
  "matchedSkills": string[],
  "missingSkills": string[],
  "keywordGaps": string[],
  "resumeImprovements": string[],
  "learningSuggestions": string[]
}

Rules:
- atsScore must reflect real ATS logic
- missingSkills are skills present in JD but absent in resume
- keywordGaps are important JD terms not found in resume
- resumeImprovements must be resume-specific
- learningSuggestions must be skill-focused
- Do NOT include markdown
- Do NOT include explanations outside JSON

Company: ${companyName || "Not specified"}
Role: ${role}

Job Description:
${jobDescription}

Resume:
${resumeText}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a strict ATS evaluator." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    let parsedResult;

    try {
      parsedResult = JSON.parse(response.choices[0].message.content);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to parse AI ATS response",
        raw: response.choices[0].message.content,
      });
    }

    res.json(parsedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "JD-based resume analysis failed",
    });
  }
};

// Advanced Job Description based resume analysis
export const analyzeResumeWithJDAdvanced = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const {
      resumeText,
      jobDescription,
      role,
      companyName,
      currentLevel,
      experienceLevel,
    } = req.body;

    if (!resumeText || !jobDescription || !role || !currentLevel) {
      return res.status(400).json({
        message:
          "resumeText, jobDescription, role, and currentLevel are required",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
You are a senior career mentor, ATS evaluator, and interview coach.

Your task is to deeply evaluate a candidate's resume against a job description,
while adjusting expectations based on the candidate's current level and the
company's known hiring culture.

Respond STRICTLY in valid JSON with the following structure:

{
  "profileAssessment": {
    "currentLevel": string,
    "targetRoleFit": string,
    "readinessVerdict": string
  },
  "atsScore": {
    "overall": number,
    "companyAdjusted": number,
    "explanation": string
  },
  "companyInsights": {
    "company": string,
    "cultureSignals": string[],
    "whatRecruitersLookFor": string[]
  },
  "skillGapAnalysis": {
    "matchedSkills": string[],
    "criticalMissingSkills": string[],
    "niceToHaveSkills": string[]
  },
  "resumeActionPlan": {
    "priority": "High" | "Medium" | "Low",
    "action": string,
    "reason": string
  }[],
  "learningRoadmapHints": {
    "skill": string,
    "whyItMatters": string,
    "howToStart": string
  }[],
  "interviewPreparationTips": {
    "technicalRounds": string[],
    "behavioralRounds": string[]
  }
}

Rules:
- Be opinionated but realistic
- Adjust strictness based on candidate level
- Base company insights on publicly known hiring patterns
- Do NOT include markdown
- Do NOT include explanations outside JSON

Company: ${companyName || "Not specified"}
Role: ${role}
Candidate Level: ${currentLevel}
Experience Level: ${experienceLevel || "Not specified"}

Job Description:
${jobDescription}

Resume:
${resumeText}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are strict, realistic, and focused on real hiring expectations.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.35,
    });

    let parsedResult;

    try {
      parsedResult = JSON.parse(response.choices[0].message.content);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to parse advanced JD AI response",
        raw: response.choices[0].message.content,
      });
    }

    const savedAnalysis = await JDResumeAnalysis.create({
      student: studentId,
      companyName,
      role,
      currentLevel,
      experienceLevel,
      jobDescription,
      resumeText,
      aiResult: parsedResult,
    });

    res.status(201).json(savedAnalysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Advanced JD resume analysis failed",
    });
  }
};

// Get adv JD analysis history
export const getAdvancedJDAnalysisHistory = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const history = await JDResumeAnalysis.find({
      student: studentId,
    })
      .sort({ createdAt: -1 })
      .select(
        "companyName role currentLevel experienceLevel aiResult createdAt"
      );

    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch advanced JD analysis history",
    });
  }
};

export const analyzeResumeWithJDAdvancedUpload = async (req, res) => {
  try {
    const studentId = req.user.userId;

    // ✅ SAFE extraction for multipart/form-data
    const body = req.body || {};

    const jobDescription = body.jobDescription;
    const role = body.role;
    const currentLevel = body.currentLevel;
    const experienceLevel = body.experienceLevel;
    const companyName = body.companyName;

    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILES:", req.files);

    // temporary logs for debugging
    //     console.log("BODY:", body);
    //     console.log("FILE:", req.file?.originalname);
    //     console.log("REQ.HEADERS:", req.headers["content-type"]);
    // console.log("REQ.BODY:", req.body);
    // console.log("REQ.FILE:", req.file);
    // console.log("REQ.FILES:", req.files);

    if (!jobDescription || !role) {
      return res.status(400).json({
        message: "jobDescription and role are required",
        receivedBody: body,
      });
    }

    const resumeFile = req.files?.resume?.[0];

    if (!resumeFile) {
      return res.status(400).json({ message: "Resume file is required" });
    }


    
    // 1️⃣ Extract text from uploaded resume
let resumeText = "";
let extractionStatus = "success";

try {
  resumeText = await extractTextFromFile(resumeFile);
} catch (error) {
  extractionStatus = "failed";
  resumeText = "";
}

    // 2️⃣ Create OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 3️⃣ Advanced prompt (same intelligence as before)
    const prompt = `
You are a senior career mentor, ATS evaluator, and interview coach.

Deeply evaluate a candidate's resume against a job description,
adjusting expectations based on candidate level and company culture.

Respond STRICTLY in valid JSON with the following structure:

{
  "profileAssessment": {
    "currentLevel": string,
    "targetRoleFit": string,
    "readinessVerdict": string
  },
  "atsScore": {
    "overall": number,
    "companyAdjusted": number,
    "explanation": string
  },
  "companyInsights": {
    "company": string,
    "cultureSignals": string[],
    "whatRecruitersLookFor": string[]
  },
  "skillGapAnalysis": {
    "matchedSkills": string[],
    "criticalMissingSkills": string[],
    "niceToHaveSkills": string[]
  },
  "resumeActionPlan": {
    "priority": "High" | "Medium" | "Low",
    "action": string,
    "reason": string
  }[],
  "learningRoadmapHints": {
    "skill": string,
    "whyItMatters": string,
    "howToStart": string
  }[],
  "interviewPreparationTips": {
    "technicalRounds": string[],
    "behavioralRounds": string[]
  }
}

Rules:
- Be opinionated but realistic
- Adjust strictness based on candidate level
- Base company insights on public hiring patterns
- No markdown
- No extra text

Company: ${companyName || "Not specified"}
Role: ${role}
Candidate Level: ${currentLevel}
Experience Level: ${experienceLevel || "Not specified"}

Job Description:
${jobDescription}

Resume:
${resumeText}
`;


    // When Ai fails to extract 
    if (!resumeText || resumeText.startsWith("Unable to extract")) {
      return res.status(400).json({
        message:
          "We couldn’t read your resume. Please upload a clear, text-based PDF or DOCX file.",
      });
    }

    // 4️⃣ Call AI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are strict, realistic, and focused on real hiring expectations.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.35,
    });

    let parsedResult;
    try {
      parsedResult = JSON.parse(response.choices[0].message.content);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to parse AI response",
        raw: response.choices[0].message.content,
      });
    }

    // 5️⃣ Save to DB
    const saved = await JDResumeAnalysis.create({
      student: studentId,
      companyName,
      role,
      currentLevel,
      experienceLevel,
      jobDescription,
      resumeText,
      extractionStatus,
      aiResult: parsedResult,
    });

    res.status(201).json(saved);
  } catch (error) {
    console.error("ADV JD UPLOAD ERROR:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};
