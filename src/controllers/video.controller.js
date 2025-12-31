import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

/* ============================
   GET ALL VIDEOS (Pagination + Search + Sort)
============================ */
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const filter = { isPublished: true };

    if (query) {
        filter.title = { $regex: query, $options: "i" };
    }

    if (userId && isValidObjectId(userId)) {
        filter.owner = userId;
    }

    const videos = await Video.find(filter)
        .sort({ [sortBy]: sortType === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("owner", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

/* ============================
   PUBLISH A VIDEO
============================ */
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const videoPath = req.files?.video?.[0]?.path;
    const thumbnailPath = req.files?.thumbnail?.[0]?.path;

    if (!videoPath || !thumbnailPath) {
        throw new ApiError(400, "Video and thumbnail are required");
    }

    const videoUpload = await uploadToCloudinary(videoPath);
    const thumbnailUpload = await uploadToCloudinary(thumbnailPath);

    if (!videoUpload?.url || !thumbnailUpload?.url) {
        throw new ApiError(500, "Cloudinary upload failed");
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        owner: req.user._id,
        isPublished: true
    });

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    );
});

/* ============================
   GET VIDEO BY ID
============================ */
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId)
        .populate("owner", "username avatar");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    );
});

/* ============================
   UPDATE VIDEO
============================ */
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (!video.owner.equals(req.user._id)) {
        throw new ApiError(403, "Unauthorized");
    }

    if (title) video.title = title;
    if (description) video.description = description;

    if (req.file?.path) {
        const thumbnailUpload = await uploadToCloudinary(req.file.path);
        video.thumbnail = thumbnailUpload.url;
    }

    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    );
});

/* ============================
   DELETE VIDEO
============================ */
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (!video.owner.equals(req.user._id)) {
        throw new ApiError(403, "Unauthorized");
    }

    await video.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "Video deleted successfully")
    );
});

/* ============================
   TOGGLE PUBLISH STATUS
============================ */
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (!video.owner.equals(req.user._id)) {
        throw new ApiError(403, "Unauthorized");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, "Publish status updated")
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};
