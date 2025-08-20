import { Gig } from "../models/Gig.model.js";

// Create Gig
const createGig = async (req, res) => {
  const { title, description, skillsRequired, budget, location } = req.body;
  try {
    const checkTitle = await Gig.findOne({ title });
    if (checkTitle) {
      return res.status(403).json({ message: "Title not available" });
    }

    const gig = new Gig({
      client: req.user._id,
      title,
      description,
      skillsRequired,
      budget,
      location,
    });

    await gig.save();
    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single gig
const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate("client", "name email")
      .populate("appliedFreelancers.user", "name email skills portfolio rate")
      .populate("assignedFreelancer", "name email skills portfolio rate");

    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all gigs
const getAllGig = async (req, res) => {
  try {
    const { search, location, minBudget, maxBudget } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skillsRequired: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }

    const gigs = await Gig.find(filter).populate("client", "name email");
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update gig
const updateGig = async (req, res) => {
  try {
    let gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    gig = await Gig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete gig
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Gig.findByIdAndDelete(req.params.id);
    res.json({ message: "Gig removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Apply to gig
const applyToGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // Prevent crash from malformed data
    const alreadyApplied = gig.appliedFreelancers.find(
      (a) => a.user && a.user.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "You already applied to this gig" });
    }

    gig.appliedFreelancers.push({
      user: req.user._id,
      status: "Pending",
    });

    await gig.save();
    res.json({ message: "Applied successfully", gig });
  } catch (err) {
    console.error("Error in applyToGig:", err);
    res.status(500).json({ message: err.message });
  }
};


const getMyApplications = async (req, res) => {
  try {
    const gigs = await Gig.find({ "appliedFreelancers.user": req.user._id })
      .populate("client", "name email")
      .populate("appliedFreelancers.user", "name email")
      .populate("reviews.client", "name email");

    const result = gigs.map((gig) => {
      const myApplication = gig.appliedFreelancers.find(
        (a) => a.user._id.toString() === req.user._id.toString()
      );

      // ✅ Find only the review for THIS freelancer
      const myReview = gig.reviews.find(
        (r) => r.freelancer.toString() === req.user._id.toString()
      );

      return {
        _id: gig._id,
        title: gig.title,
        description: gig.description,
        budget: gig.budget,
        location: gig.location,
        client: gig.client,
        status: myApplication?.status || "Pending",
        review: myReview
          ? {
              rating: myReview.rating,
              comment: myReview.comment,
              reviewer: myReview.client, // includes name/email
            }
          : null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Error in getMyApplications:", err.message);
    res.status(500).json({ message: err.message });
  }
};




// Get gigs created by client
const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ client: req.user._id })
      .populate("appliedFreelancers.user", "name email skills");
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get applications for a gig
const getGigApplications = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate("appliedFreelancers.user", "name email skills portfolio rate");

    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.client.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this gig's applications" });
    }

    res.json(gig.appliedFreelancers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const acceptApplication = async (req, res) => {
  try {
    const { id, freelancerId } = req.params;

    const gig = await Gig.findById(id).populate("appliedFreelancers.user", "_id name email");
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // Find application
    const application = gig.appliedFreelancers.find((a) => {
      if (!a.user) return false;
      const userId = a.user._id ? a.user._id.toString() : a.user.toString();
      return userId === freelancerId;
    });

    if (!application) {
      return res.status(400).json({ message: "Freelancer did not apply" });
    }

    application.status = "Accepted";
    gig.status = "In Progress";
    gig.assignedFreelancer = application.user._id;

    await gig.save();
    res.json({ message: "Freelancer accepted", gig });
  } catch (err) {
    console.error("Error in acceptApplication:", err);
    res.status(500).json({ message: err.message });
  }
};

const rejectApplication = async (req, res) => {
  try {
    const { id, freelancerId } = req.params;

    const gig = await Gig.findById(id).populate("appliedFreelancers.user", "_id name email");
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    const application = gig.appliedFreelancers.find((a) => {
      if (!a.user) return false;
      const userId = a.user._id ? a.user._id.toString() : a.user.toString();
      return userId === freelancerId;
    });

    if (!application) {
      return res.status(400).json({ message: "Freelancer did not apply" });
    }

    application.status = "Rejected";
    await gig.save();

    res.json({ message: "Freelancer rejected", gig });
  } catch (err) {
    console.error("Error in rejectApplication:", err);
    res.status(500).json({ message: err.message });
  }
};



const completeGig = async (req, res) => {
  try {
    const { id } = req.params;
    const gig = await Gig.findById(id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // Only client can mark as completed
    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    gig.status = "Completed";
    await gig.save();

    res.json({ message: "Gig marked as completed", gig });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add review
const addReview = async (req, res) => {
  try {
    const { id } = req.params; // gigId
    const { rating, comment } = req.body;

    const gig = await Gig.findById(id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // Only client can review after gig is completed
    if (gig.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (gig.status !== "Completed") {
      return res.status(400).json({ message: "Gig must be completed to review" });
    }

    // Push review
    gig.reviews.push({
      freelancer: gig.assignedFreelancer,
      client: req.user._id,
      rating,
      comment,
    });

    await gig.save();

    res.json({ message: "Review added successfully", gig });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all reviews of a freelancer
const getFreelancerReviews = async (req, res) => {
  try {
    const { freelancerId } = req.params;
    const gigs = await Gig.find({ "reviews.freelancer": freelancerId }).populate(
      "reviews.client",
      "name email"
    );

    const reviews = gigs.flatMap((g) =>
      g.reviews.filter((r) => r.freelancer.toString() === freelancerId)
    );

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





export {
  createGig,
  updateGig,
  getAllGig,
  deleteGig,
  applyToGig,
  getMyApplications,
  getGig,
  getMyGigs,
  getGigApplications,
  rejectApplication,
  acceptApplication,
  completeGig,
  addReview,
  getFreelancerReviews
};
