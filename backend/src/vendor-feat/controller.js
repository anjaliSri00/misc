const jwt = require("jsonwebtoken");
const vendorService = require("./service");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Mock email function - replace with actual email service
async function sendEmail(to, subject, html) {
  console.log(`Mock email sent to: ${to}, Subject: ${subject}`);
  return { success: true, message: "Email sent successfully" };
}

async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    const user = await vendorService.loginUser(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    
    // Set Authorization header in response
    res.setHeader('Authorization', `Bearer ${token}`);
    
    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const createVendorDetails = async (req, res) => {
  try {
    const result = await vendorService.createVendorDetails(req.body);
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }
    // Get email safely (knex returns array from insert)
    const recipientEmail = req.body.email || result.data[0]?.email;
    console.log("Recipient email:", recipientEmail);

    let emailResponse = null;
    if (recipientEmail && recipientEmail.trim() !== "") {
      try {
        // Send email notification
        emailResponse = await sendEmail(
          recipientEmail,
          "You are successfully registered as a vendor",
          `<p>Your vendor registration has been successfully completed.</p>
             <p>Your vendor ID is: <strong>${result.data[0]?.id}</strong></p>
             <p>Thank you for registering with us!</p>`
        );
        console.log("Email sent successfully to:", recipientEmail);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the whole request if email fails
        emailResponse = {
          success: false,
          message: "Email sending failed",
          error: emailError.message,
        };
      }
    } else {
      console.log("No email provided, skipping email notification");
      emailResponse = { success: false, message: "No email provided" };
    }

    return res.status(201).json({
      data: result.data,
      email: emailResponse,
    });
  } catch (error) {
    console.error("Error creating vendor details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getVendorList = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    // Extract filters from query parameters
    const filters = {
      state: req.query.state || null,
      city: req.query.city || null,
      is_msme: req.query.is_msme || null,
      country: req.query.country || null,
      company_status: req.query.company_status || null,
      items_interested: req.query.items_interested || null,
    };

    const result = await vendorService.getVendorList(
      page,
      limit,
      search,
      filters,
      req.user
    );

    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }

    return res.status(200).json({ message: "Vendor list retrieved successfully", data: result.data });
  } catch (error) {
    console.error("Error in getVendorList controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getVendorDetails = async (req, res) => {
  try {

    const vendorId = req.params.vendor_id;

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }

    const result = await vendorService.getVendorDetails(vendorId, req.user);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    return res.status(200).json({ message: "Vendor details retrieved successfully", data: result.data });
  } catch (error) {
    console.error("Error in getVendorDetails controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getVendorFilters = async (req, res) => {
  try {
    const filters = {
      city: req.query.city || undefined,
      items_interested: req.query.items_interested || undefined,
      company_status: req.query.company_status || undefined
    };
    const result = await vendorService.getVendorFilters(filters);
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }
    return res.status(200).json({ message: "Vendor filters retrieved successfully", data: result.data });
  } catch (error) {
    console.error("Error in getVendorFilters controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  loginController,
  createVendorDetails,
  getVendorList,
  getVendorDetails,
  getVendorFilters
};
