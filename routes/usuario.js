const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')

router.get('/registro', (req,res) => {
    res.render('usuarios/registro')
})

router.post('/registro', (req,res) => {
    
    const erros = []
    const data = req.body
    console.log(data)
    if(!data.nome){
        erros.push({texto: 'Nome inválido!'})
    } 

    if(!data.email){
        erros.push({texto: 'Email inválido!'})
    }

    if(!data.senha){
        erros.push({texto: 'Senha inválida!'})
    }

    if(data.senha.length < 4){
        erros.push({texto: 'Senha muito curta!!'})
    }

    if(data.senha != req.body.senha2 ){
        erros.push({texto: 'senha diferente, tente novamente!'})
    }

    if(erros.length > 0){
       
        res.render('usuarios/registro', {erros: erros})
        return 
    }
 
    Usuario.findOne({email: data.email}).then((usuario) => {
        if(usuario){
            req.flash('error_msg', 'Já existe uma conta')
            return
        }

         bcrypt.genSalt(10).then((salt) => {
            return bcrypt.hash(data.senha, salt)
        }).then((pass) => {
            const novoUsuario = new Usuario({
                nome: data.nome,
                email: data.email,
                senha: pass,
            })
            
            novoUsuario.save()
                .then(() => {
                    req.flash('success_msg', 'Usuario criado com sucesso!')
                    res.redirect('/')
                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao criar o usuario,tente novamente!')
                    res.redirect('/usuarios/registro')
                    
                })
        })

        
        
        

    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/')
    })  
})

module.exports = router
