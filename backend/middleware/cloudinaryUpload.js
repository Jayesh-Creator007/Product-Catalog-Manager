const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        // Only accept image files
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files allowed'));
        }
        cb(null, true);
    }
});

// Middleware to upload to Cloudinary
const uploadToCloudinary = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        // Convert buffer to stream
        const stream = Readable.from(req.file.buffer);

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'products',
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(400).json({
                        success: false,
                        message: 'Image upload failed'
                    });
                }

                // Store URL and publicId in request for controller
                req.cloudinaryUrl = result.secure_url;
                req.cloudinaryPublicId = result.public_id;
                next();
            }
        );

        stream.pipe(uploadStream);
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return res.status(400).json({
            success: false,
            message: 'Image upload error'
        });
    }
};

// Function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return;
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image: ${publicId}`);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
    }
};

module.exports = {
    upload,
    uploadToCloudinary,
    deleteFromCloudinary
};
