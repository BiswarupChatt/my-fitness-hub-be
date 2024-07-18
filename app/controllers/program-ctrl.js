const Program = require('../models/program-model')
const Coach = require('../models/coach-model')
const { validationResult } = require('express-validator')
const programCtrl = {}


programCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const findCoach = await Coach.findOne({ user: req.user.id })
        if (!findCoach) {
            return res.status(400).json({ errors: "Coach doesn't exists" })
        }
        const programData = {
            coach: req.user.id,
            programName: req.body.programName,
            description: req.body.description,
            duration: req.body.duration
        }
        const program = new Program(programData)
        await program.save()
        res.status(201).json(program)
    } catch (err) {
        res.status(500).json({ errors: 'Something went wrong' })
    }
}

programCtrl.get = async (req, res) => {
    try {
        const findProgram = await Program.find({ coach: req.user.id }).populate('coach')
        res.status(201).json(findProgram)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong' })
    }
}


module.exports = programCtrl