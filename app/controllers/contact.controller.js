const ContactService = require('../services/contact.service.js')
const MongoDB = require('../utils/mongodb.util.js')
const ApiError = require('../api-error.js')

exports.create = async (req, res, next) => {
    if(!req.body?.name)
        return next(new ApiError(400, "Name can not be empty"))
    try {
        const contactService = new ContactService(MongoDB.client)
        const doc = await contactService.create(req.body)
        res.json(doc)
    } catch (err) {
        return next(new ApiError(500, "An error occurred while creating the contact"))
    }
};

exports.findAll = async (req, res, next) => {
    let docs = []
    try {
        const contactService = new ContactService(MongoDB.client)
        const { name } = req.query
        if(name)
            docs = await contactService.findByName(name)
        else
            docs = await contactService.find({})
        res.json(docs)
    } catch(err) {
        return next(new ApiError(500, "An error ocurred while retieving contacts"))
    }
};

exports.findOne = async (req, res, next) => {
    const { id } = req.params
    try {
        if(!id)
            return next(new ApiError(400, "Id is not valid"))
        const contactService = new ContactService(MongoDB.client)
        const doc = await contactService.findById(id)
        if(!doc || !doc.length)
            return next(new ApiError(404, "Contact not found"))
        res.json(doc)
    } catch(err) {
        return next(new ApiError(500, `Error retieving contact with id = ${id}`))
    }
};

exports.update = async (req, res, next) => {
    const { id } = req.params
    const payload = req.body
    try {
        if(!id)
            return next(new ApiError(400, "Id is not valid"))
        if(Object.keys(payload).length === 0) 
            return next(new ApiError(400, "Data to update can not be empty"))
        const contactService = new ContactService(MongoDB.client)
        const doc = await contactService.update(id, payload)
        if(!doc)
            return next(new ApiError(401, "Contact not found"))
        res.json(doc)
    } catch(err) {
        return next(new ApiError(500, `Error updating contact with id = ${id}`))
    }
};

exports.delete = async (req, res, next) => {
    const { id } = req.params
    try {
        if(!id)
            return next(new ApiError(400, "Id is not valid"))
        const contactService = new ContactService(MongoDB.client)
        const doc = await contactService.delete(id)
        if(!doc)
            return next(new ApiError(401, "Contact not found"))
        res.json(doc)
    } catch(err) {
        return next(new ApiError(500, `Could not delete contact with id=${id}`))
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client)
        const deleteCount = await contactService.deleteAll()
        return res.send({
            message: `${deleteCount} contacts were deleted successfully`,
        })
    } catch(err) {
        return next(new ApiError(500, "An error occurred while removing all contacts"))
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client)
        const doc = await contactService.findFavorite()
        res.json(doc)
    } catch(err) {
        return next(new ApiError(500, "An error occurred while retieving favorite contacts"))
    }
};