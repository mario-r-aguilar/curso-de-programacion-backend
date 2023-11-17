import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartSchema = mongoose.Schema({
	products: {
		type: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'products',
				},
				quantity: { type: Number, default: 1 },
			},
		],
		default: [],
	},
});

// Middleware para ver los productos completos cuando busco un carrito en particular (no solo el _id)
cartSchema.pre('findOne', function () {
	this.populate('products.product');
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
