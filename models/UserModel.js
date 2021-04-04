let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
	nombre: String,
	apellido: String,
	edad: Number,
	dni: Number,
	correo: String,
	password: String,
	direccion: String,
	telefono: String,
	celular: String,
	fecha_creacion: Date,
	fecha_actualizacion: Date,
	url_imagen: String,
	estado: Boolean,
	isAdmin: Boolean,
})

userSchema.statics.AddUser = function(user, callback){ //Method for add user in schema of database
	return this.create(user,callback);
};

userSchema.statics.FindUserAll = function(callback){ //Method for find alls user in schema, i havent filters
	return this.find({},callback);
};

userSchema.statics.FindUserByDNI = function(dni,callback){
	return this.findOne({ dni:dni },callback);
};

userSchema.statics.FindUserByID = function(id,callback){
	return this.findOne({ _id:id },callback);
};

userSchema.statics.FindUserByCorreo = function(correo,password,callback){
	return this.findOne({correo:correo,password:password},callback);
};

userSchema.statics.FindUserByEmail = function(correo,callback){
	return this.findOne({correo:correo},callback);
};


userSchema.statics.RemoveUserByDNI = function(dni, callback){
	return this.deleteOne({ dni:dni },callback);
};

userSchema.statics.UpdateUser = function(user, callback){
	return user.save()
}

module.exports = mongoose.model('users',userSchema);