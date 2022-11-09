const router = require("express").Router();
const Note = require("../models/Note");
const { isAuth } = require("../helpers/auth");
const { body, validationResult } = require('express-validator');

router.get("/notes", isAuth, async (req, res) => {
    await Note.find({ userId: req.user._id}).sort({ date: 'desc' }).lean().exec((err, notes) => {
        res.render("notes/notes", { notes });
    });
});

router.get("/notes/new", isAuth, ({res}) => {
    res.render("notes/new");
});

router.post("/notes/new",
    body("title", "Empty title.").notEmpty(),
    body("description", "Empty description.").notEmpty(), isAuth, async (req, res) => {
        const { title, description } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("errors_msg", errors.errors);
            res.redirect("back");
        } else {
            const NewNote = Note({ title, description });
            NewNote.userId = req.user._id;
            await NewNote.save();
            req.flash("success_msg", "Note added successfully.");
            res.redirect("/notes");
        }
    });

router.get("/notes/edit/:id", isAuth, async (req, res) => {
    await Note.findById(req.params.id).lean().exec((err, notes) => {
        res.render("notes/edit", { notes });
    });
});

router.put("/notes/update/:id",
    body("title", "Empty title.").notEmpty(),
    body("description", "Empty description.").notEmpty(), isAuth, async (req, res) => {
        const { title, description } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("errors_msg", errors.errors);
            res.redirect("back");
        } else {
            await Note.findByIdAndUpdate(req.params.id, { title, description });
            req.flash("success_msg", "Note updated successfully.");
            res.redirect("/notes");
        }
    });

router.delete("/notes/delete/:id", isAuth, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Note deleted successfully.");
    res.redirect("/notes");
});

module.exports = router;