import { generateResponse } from "../config/openRouter.js";
import extractJson from "../utils/extractJson.js";
import websiteModel from "../model/websiteModel.js";
import User from "../model/userModel.js";

const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Business-ready content (NO lorem ipsum)
- Smooth transitions & hover effects
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No dead UI
- No broken buttons
--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID

--------------------------------------------------
MINIMUM WEBSITE COMPLEXITY
--------------------------------------------------

The generated website must contain
at least 4 distinct SPA pages.

Single-section or single-page applications are invalid.

Even utility apps such as calculators,
converters, todo apps, weather apps,
must include:

- Landing Page
- Main Tool Page
- Features Page
- About/Help Page

All pages must be navigable through
JavaScript SPA routing.

--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
If user requests a business/company website:
- Home
- About
- Services
- Contact

If user requests a SaaS:
- Home
- Features
- Pricing
- Contact

If user requests a Calculator:
- Calculator
- Features
- About
- Help

If user requests a Portfolio:
- Home
- Projects
- Skills
- Contact

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation must switch pages using JS
- Active nav state must update
- Forms must have JS validation
- Buttons must show hover + active states
- Smooth section/page transitions

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction

IF ANY CHECK FAILS → RESPONSE IS INVALID

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`;

export const generateWebdite = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "prompt is required" });
    }
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    if (user.credits < 50) {
      return res
        .status(400)
        .json({ message: "you have not enough credits to generate a website" });
    }

    const finalPrompt = masterPrompt.replace("USER_PROMPT", prompt);

    let raw = "";
    let parsed = null;

    for (let i = 0; i < 2 && !parsed; i++) {
      raw = await generateResponse(finalPrompt);
      parsed = await extractJson(raw);

      if (!parsed) {
        raw = await generateResponse(finalPrompt + "\n\nRETURN ONLY RAW JSON");
        parsed = await extractJson(raw);
      }
    }

    if (!parsed || !parsed.code) {
      // console.log("ai returned invalid response", raw);
      return res.status(400).json({ message: "ai returned invalid response" });
    }

    const website = await websiteModel.create({
      user: user._id,
      title: prompt.slice(0, 60),
      latestCode: parsed.code,
      // slug: `${prompt
      //   .toLowerCase()
      //   .replace(/\s+/g, "-")
      //   .slice(0, 30)}-${Date.now()}`,
      conversation: [
        { role: "user", content: prompt },
        {
          role: "ai",
          content: parsed.message,
        },
      ],
    });

    user.credits = user.credits - 50;

    await user.save();
    // console.log("CREATED WEBSITE:", website);
    // console.log("Website saved successfully");

    return res.status(201).json({
      websiteId: website._id,
      remainingCedits: user.credits,
    });
  } catch (error) {
    console.error("GENERATE WEBSITE ERROR:", error);
    return res
      .status(500)
      .json({ message: `generate website error:  ${error}` });
  }
};

export const getWebsiteById = async (req, res) => {
  try {
    // console.log("Website ID:", req.params.id);

    const website = await websiteModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    // console.log("Found website:", website);

    if (!website) {
      return res.status(404).json({
        message: "website not found",
      });
    }

    return res.status(200).json(website);
  } catch (error) {
    return res.status(500).json({
      message: `get website by id ${error}`,
    });
  }
};

export const changes = async (req, res) => {
  try {
    // console.log("BODY:", req.body);
    // console.log("PARAMS:", req.params);

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "prompt is required" });
    }

    const website = await websiteModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({
        message: "website not found",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    console.log("User Credits:", user.credits);

    if (user.credits < 25) {
      return res.status(400).json({
        message: "you have not enough credits to generate a website",
      });
    }

    const updatePrompt = `
    UPDATE THIS HTML WEBSITE.
    
    CURRENT CODE:
    ${website.latestCode}

    USER REQUEST:
    ${prompt}

    RETURN RAW JASON ONLY:
    {
      "message" : "short confirmation",
      "code": "<UPDATED FULL HTML>"
    }`;

    let raw = "";
    let parsed = null;

    for (let i = 0; i < 2 && !parsed; i++) {
      raw = await generateResponse(updatePrompt);

      // console.log("========== AI RAW RESPONSE ==========");
      //console.log(raw);
      //console.log("====================================");

      parsed = await extractJson(raw);
      // console.log("PARSED RESPONSE:");
      //console.log("PARSED:", parsed);

      if (!parsed) {
        raw = await generateResponse(updatePrompt + "\n\nRETURN ONLY RAW JSON");
        parsed = await extractJson(raw);
      }
    }

    if (!parsed || !parsed.code) {
      // console.log("ai returned invalid response", raw);
      return res.status(400).json({ message: "ai returned invalid response" });
    }

    website.conversation.push(
      {
        role: "user",
        content: prompt,
      },
      {
        role: "ai",
        content: parsed.message,
      },
    );

    website.latestCode = parsed.code;

    await website.save();

    user.credits = user.credits - 25;
    await user.save();

    return res.status(200).json({
      message: parsed.message,
      code: parsed.code,
      remainingCedits: user.credits,
    });
  } catch (error) {
    return res.status(500).json({ message: `update website error ${error}` });
  }
};

export const getAll = async (req, res) => {
  try {
    const websites = await websiteModel.find({ user: req.user._id });
    return res.status(200).json(websites);
  } catch (error) {
    return res.status(500).json({ message: `get all website error ${error}` });
  }
};

export const deploy = async (req, res) => {
  try {
    const website = await websiteModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({
        message: "website not found",
      });
    }

    if (!website.slug) {
      website.slug =
        website.title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 60) + website._id.toString().slice(-5);
    }

    website.deployed = true;
    website.deployeUrl = `${process.env.FRONTEND_URL}/site/${website.slug}`;
    await website.save();

    return res.status(200).json({
      url: website.deployeUrl,
    });
  } catch (error) {
    return res.status(200).json({ message: "deploye website error" });
  }
};

export const getBySlug = async (req, res) => {
  try {
    const website = await websiteModel.findOne({
      slug: req.params.slug,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({
        message: "website not found",
      });
    }

    return res.status(200).json(website);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get by slug website error : ${error}` });
  }
};
