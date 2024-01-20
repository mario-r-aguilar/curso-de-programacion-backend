export default class UserDTO {
	constructor(user) {
		this.name = user?.name ?? 'You are not logged in';
		this.lastname = user?.lastname ?? 'Logged in please';
		this.email = user?.email ?? '';
		this.age = user?.age ?? '';
		this.role = user?.role ?? '';
	}
}
