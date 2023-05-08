const { Visit } = require('../Models/visitsRecordModel');
const { User } = require('../Models/usersModel');
const _ = require('lodash');
const { userRoles, messages } = require('../constants');
const { sendEmail } = require('../Utils/sendEmail');

/*
    Description: keep record of visit to shop by representative
    Request body: {
        visited: id of shopkeeper visited
        purpose: purpose of the visit
        review: review from the visit
    }
*/
async function addVisit(req, res) {
    try {
        let user = await User.findOne({ _id: req.body.visited });

        if (!user) return res.status(404).json({ message: messages.OBJECT_NOT_FOUND });

        if (user && user.role != userRoles.SHOPKEEPER) return res.status(404).json({ message: 'Invalid Shopkeeper ID!!!' });

        visit = new Visit(req.body);
        visit.visitor = req.id;

        //sending email to shopkeeper about review
        let verifyEmailSent =  await sendEmail(
                                        user.email,
                                        'Review sent by Representative',
                                        `The representative visited your shop give review that - ${visit.review}`
                                    );

        if(verifyEmailSent != 1) {
            return res.status(400).json({ 
                message: 'Email not sent. Please connect to valid network and try again' 
            });
        }
        
        await visit.save();
        
        return res.status(200).json({
            message: "Success",
            visit: _.pick(visit, ['_id', 'visitor', 'visited', 'purpose', 'review', 'time']),
        });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

/*
    Description: to view visits
    query params: {
        visitor: id of representative
             or
        visited: id of shopkeeper 
             or
        nothing for all users
    }
*/
async function viewVisit(req, res) {
    try {
        let visits = await Visit
            .find(req.query)
            .select('-__v -owner');

        if (!visits || visits.length == 0) return res.status(404).json({ message: messages.OBJECT_NOT_FOUND });

        return res.status(200).json({ message: "Success", visits: visits });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

async function deleteVisit(req, res) {
    // delete the visits
}

module.exports = {
    addVisit,
    viewVisit
};