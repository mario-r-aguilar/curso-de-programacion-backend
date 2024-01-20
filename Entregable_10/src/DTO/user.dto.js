export default class UserDTO {
	constructor(user) {
		this.name = user?.name ?? 'You are not logged in';
		this.lastname = user?.lastname ?? 'You are not logged in';
		this.email = user?.email ?? 'You are not logged in';
		this.age = user?.age ?? 'You are not logged in';
		this.role = user?.role ?? 'You are not logged in';
	}
}
