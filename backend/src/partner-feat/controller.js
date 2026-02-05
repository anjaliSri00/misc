const partnerService = require("./service");

const createPartner = async (req, res) => {
  try {
    const result = await partnerService.createPartner(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    return res.status(201).json({ message: "Partner created", data: result.data });
  } catch (error) {
    console.error("Error creating partner:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getPartnerList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const result = await partnerService.getPartnerList(page, limit, search);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    return res.status(200).json({ message: "Partners fetched", data: result.data });
  } catch (error) {
    console.error("Error listing partners:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getPartnerDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.partner_id);
    const result = await partnerService.getPartnerDetails(id);
    if (!result.success) {
      const status = result.notFound ? 404 : 400;
      return res.status(status).json({ message: result.message });
    }
    return res.status(200).json({ message: "Partner details fetched", data: result.data });
  } catch (error) {
    console.error("Error fetching partner details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPartner,
  getPartnerList,
  getPartnerDetails,
};
