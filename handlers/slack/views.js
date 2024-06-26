const db = require('../../models')

const {
    survey: Survey,
    user: User,
    surveyAnswer: SurveyAnswer,
    workspaceUser: WorkspaceUser,
} = db

module.exports = (slackApp) => {
    slackApp.view('view_1', async ({ body, ack, payload }) => {
        await ack()
        console.log(body)
        console.log(payload)

        let survey
        let user
        try {
            survey = await Survey.findOne({
                where: { name: body.view.title.text },
            })
        } catch (error) {
            console.log('>> Error while finding survey: ', err)
        }

        try {
            user = await WorkspaceUser.findOne({
                where: { userId: body.user.id },
            })
        } catch (error) {
            console.log('>> Error while finding user: ', err)
        }

        if (survey.id && user.id) {
            try {
                await SurveyAnswer.create({
                    answers: JSON.stringify(payload.state.values),
                    surveyId: survey.id,
                    userId: user.id,
                })
            } catch (error) {
                console.log('>> Error saving survey answers:', error)
            }
        }

        try {
            await slackApp.client.chat.update({
                channel: user.userId,
                ts: user.postedTimestamp,
                blocks: [
                    {
                        type: 'header',
                        text: {
                            type: 'plain_text',
                            text: 'Successfully submitted your answer! :v:',
                            emoji: true,
                        },
                    },
                ],
            })
        } catch (error) {
            console.error('>> Error updating message:', error)
        }
    })
}
