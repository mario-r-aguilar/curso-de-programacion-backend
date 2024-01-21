import { Product, Cart, User, Chat, Ticket } from '../DAO/factory.js';
import selectedPersistence from '../config/persistence.js';

import ProductRepository from './product.repository.js';
import CartRepository from './cart.repository.js';
import UserRepository from './user.repository.js';
import ChatRepository from './chat.repository.js';
import TicketRepository from './ticket.repository.js';

// Esta configuración se realiza así porque la persistencia FILE no posee todos los dao desarrollados
const ProductService = new ProductRepository(new Product());
const CartService = new CartRepository(new Cart());

// Crear instancias adicionales solo si la persistencia seleccionada no es 'FILE'
let UserService, ChatService, TicketService;
if (selectedPersistence.persistence !== 'FILE') {
	UserService = new UserRepository(new User());
	ChatService = new ChatRepository(new Chat());
	TicketService = new TicketRepository(new Ticket());
}

export { ProductService, CartService, UserService, ChatService, TicketService };
