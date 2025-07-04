import Product from "../models/productModel.js";
import user from "../models/userModel.js";
import Wishlist from "../models/wishlistModel.js";

export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId, status } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId və productId tələb olunur" });
    }

    const foundUser = await user.findById(userId); 
    const product = await Product.findById(productId);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingWishlistItem = await Wishlist.findOne({
      user: userId,
      "product._id": productId,
    });

    if (existingWishlistItem) {
      if (existingWishlistItem.status === status) {
        return res.status(400).json({ message: "Product already in wishlist with this status" });
      } else {
        existingWishlistItem.status = status;
        await existingWishlistItem.save();
        return res.status(200).json({ message: "Wishlist status updated", wishlistItem: existingWishlistItem });
      }
    }

    const wishlistItem = new Wishlist({
      user: userId,
      product: {
        _id: product._id,
        image: product.image,
        title: product.title,
        description: product.description,
        author: product.author,
        price: product.price,
        categories: product.categories,
        rating: product.rating,
      },
      status: status || 'wantToRead', 
      addedAt: new Date()
    });

    await wishlistItem.save();
    res.status(201).json({ message: "Book added to wishlist", wishlistItem });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlistItems = await Wishlist.find({ user: userId }).populate("product").exec();

    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error("Xəta baş verdi:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateWishlistStatus = async (req, res) => {
  try {
    const { userId, productId, status } = req.body;

    if (!userId || !productId || !status) {
      return res.status(400).json({ message: "User ID, Product ID, and status are required" });
    }

    const wishlistItem = await Wishlist.findOne({ user: userId, "product._id": productId });

    if (!wishlistItem) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    wishlistItem.status = status;
    await wishlistItem.save();

    res.status(200).json({ message: "Wishlist status updated", wishlistItem });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
;

export const removeFromWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;

    const wishlistItem = await Wishlist.findById(wishlistId);

    if (!wishlistItem) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    await wishlistItem.deleteOne();

    res.status(200).json({ message: "Book removed from wishlist" });
  } catch (error) {
    console.error("Xəta baş verdi:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
