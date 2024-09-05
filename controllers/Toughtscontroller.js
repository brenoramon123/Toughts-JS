const { where } = require("sequelize")
const Tought = require("../models/Tought")
const User = require("../models/User")

const {Op} = require("sequelize")

module.exports = class ToughtController{
    static async showAll(req,res){
        let search = "";
        if(req.query.search){
            search = req.query.search;

        }

        let order = "DESC"

        if(req.query.order === "old"){
            order = "ASC"
        }else{
            order = "DESC"
        }

        let toughts = Tought.findAll({include:User,where:{title:{[Op.like]:`%${search}%`}},order:[[`createdAt`,order]]})
        toughts = (await toughts).map((result)=> result.get({plain:true}))
        console.log("toughts",toughts)

        let toughtsQti = toughts.length




        if(toughtsQti ===0){
            toughtsQti = false
        }
        res.render("toughts/home",{toughts,search,toughtsQti})
    }

    static async dashboard(req,res){
        const userId = req.session.userId

        const user = await User.findOne({where:{
            id:userId
        }
        ,
        include:Tought,
        plain:true
    })

        if(!user){
            res.redirect("/login");

        }

        const toughts = user.Toughts.map(i => i.dataValues)
        let empty = false;
        if(toughts.length===0){
            empty=true
        }
      
        res.render("toughts/dashboard",{toughts,empty})
    }

    static createTought(req,res){
        res.render("toughts/create")
    }

    static async createToughtSave(req,res){
    
        const tought = {title:req.body.title,UserId:req.session.userId} 
        try {
            await Tought.create(tought);

        req.session.save(()=>{
            res.redirect("/toughts/dashboard")
        })
        } catch (error) {
            console.log(error)
        }
        
    }

    static async deleteTought(req,res){
    const id = req.body.id
        const UserId = req.session.userId

        try {
            await Tought.destroy({where:{id:id,UserId:UserId}})
            req.session.save(()=>{
                res.redirect("/toughts/dashboard")
            })
        } catch (error) {
            console.log(error)
        }
        
    }

    static async updateTought(req,res){
        const {id} = req.params

        const tought = await Tought.findOne({where:{id:id},raw:true})
console.log("tought",tought)
        res.render("toughts/edit",{tought})
    }


    static async updateToughtSave(req, res) {
        // Extrai o id do pensamento e o novo título do corpo da requisição
        const { id } = req.body;
        const tought = {
            title: req.body.title
        };
    
        try {
            // Atualiza o pensamento no banco de dados
            await Tought.update(tought, {
                where: { id: id } // Especifica qual pensamento deve ser atualizado
            });
    
            // Garante que a sessão seja salva antes de redirecionar
            req.session.save(() => {
                res.redirect("/toughts/dashboard");
            });
    
        } catch (error) {
            console.error('Error updating tought:', error);
            res.status(500).send('Internal server error');
        }
    }
    
}
