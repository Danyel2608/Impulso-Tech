const Login = require("../Model/loginModel");

const confirmarEmail = async (req, res) => {
    const emailUser = req.params.email; // Obtener el correo electrónico codificado de la URL

    try {
        // Buscar el usuario por el correo electrónico decodificado en la base de datos
        const user = await Login.findOne({ email: emailUser });

        if (user) {
            // Si se encuentra el usuario, actualizar el estado de confirmEmail a true
            user.confirmEmail = true;
            await user.save();

            // Redireccionar al usuario a la página de inicio de sesión
            res.json({
                data: {
                    confirmado: true,
                    email: emailUser,
                    message: 'Correo electrónico confirmado correctamente.'
                }
            });
        } else {
            // Si no se encuentra el usuario, redireccionar al usuario a una página de error o mostrar un mensaje de error
            console.log("No se encuentra al usuario");
            res.json({
                data: {
                    confirmado: false,
                    message: 'Correo electrónico no encontrado.'
                }
            });
        }
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la búsqueda o actualización del usuario
        console.log('Error al confirmar correo electrónico:', error);
        res.json({
            confirmado: false,
            message: 'Error al confirmar correo electrónico.'
        });
    }
};

module.exports = { confirmarEmail };
