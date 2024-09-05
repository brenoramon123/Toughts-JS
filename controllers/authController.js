const User = require("../models/User");

const bcrypt = require("bcryptjs")


module.exports = class AuthController{
    static async login(req,res){
        res.render("auth/login")
    }

    static async register(req,res){
        res.render("auth/register")
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmPassword } = req.body;
        console.log("dados", name, email, password, confirmPassword);
    
        if (password !== confirmPassword) {
            req.flash("message", "As senhas não conferem, tente novamente.");
            return res.render("auth/register");
        }
    
        const checkUserExists = await User.findOne({ where: { email: email } });
        if (checkUserExists) {
            req.flash("message", "O email já está em uso.");
            return res.render("auth/register");
        }
    
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
    
        const user = {
            name,
            email,
            senha: hashedPassword,
        };
    
        console.log("dados formatados:", user);
    
        try {
           const createdUser =  await User.create(user);
           console.log("usuario criado",createdUser)
            //inicializa a sessao
            req.session.userId = createdUser.dataValues.id
            req.flash("message", "Cadastro realizado com sucesso.");
            req.session.save(()=>{
                res.redirect("/");
            })
            
        } catch (error) {
            console.log(error);
            req.flash("message", "Ocorreu um erro ao tentar registrar o usuário.");
            res.render("auth/register");
        }
    }

    static logOut(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Erro ao destruir a sessão:", err);
                return res.status(500).send("Erro ao fazer logout");
            }
    
            // Remove o cookie de sessão explicitamente para garantir que ele seja apagado
            res.clearCookie('connect.sid'); // substitua 'connect.sid' pelo nome do cookie de sessão se for diferente
            res.redirect("/login");
        });
    }

    static async loginPost(req, res) {
        const { email, senha } = req.body;
        
        try {
            // Verifica se o usuário existe no banco de dados
            const user = await User.findOne({ where: { email: email } });
    
            if (!user) {
                req.flash("message", "Usuário não encontrado!");
                return res.render("auth/login");
            }
    
            // Verifica a senha
            const passwordMatch = bcrypt.compareSync(senha, user.dataValues.senha);
    
            if (!passwordMatch) {
                req.flash("message", "Senha inválida!");
                return res.render("auth/login");
            }
    
            // Se a senha estiver correta, configura a sessão
            req.session.userId = user.dataValues.id;
    
            // Mensagem de sucesso e redirecionamento
            req.flash('message', 'Login realizado com sucesso!');
            
            // Salva a sessão e redireciona
            req.session.save(() => {
                res.redirect('/');
            });
    
        } catch (error) {
            console.error("Erro ao tentar fazer login:", error);
            req.flash("message", "Ocorreu um erro. Por favor, tente novamente.");
            res.render("auth/login");
        }
    }
    
    
}
