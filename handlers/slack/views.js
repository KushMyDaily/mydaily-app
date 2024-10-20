const db = require('../../models')
const { WebClient } = require('@slack/web-api')
const SlackService = require('../../service/slack.service')

const {
    survey: Survey,
    user: User,
    surveyAnswer: SurveyAnswer,
    workspaceUser: WorkspaceUser,
} = db
const webClient = new WebClient()
const slackService = new SlackService()

module.exports = (slackApp) => {
    slackApp.view('view_1', async ({ body, ack, payload }) => {
        await ack()
        console.log(body)
        console.log(payload)

        const answer01 =
            payload?.state?.values?.q01?.q01?.selected_option?.value
        const answer02 =
            payload?.state?.values?.q02?.q02?.selected_option?.value
        const surveyId = payload?.private_metadata

        let user
        try {
            user = await WorkspaceUser.findOne({
                where: { userId: body?.user?.id },
            })
        } catch (error) {
            console.log('>> Error while finding user: ', err)
        }

        if (surveyId && user && answer01 && answer02) {
            const answers = [Number(answer01), Number(answer02)]
            try {
                await SurveyAnswer.create({
                    answers: JSON.stringify(answers),
                    surveyId: Number(surveyId),
                    userId: user.id,
                })
            } catch (error) {
                console.log('>> Error saving survey answers:', error)
            }

            try {
                let token
                await slackService
                    .authorize(user?.teamId)
                    .then((res) => {
                        token = res.botToken
                    })
                    .catch((err) => {
                        throw new Error('Failed authorize token', err)
                    })
                await webClient.chat.update({
                    token: token,
                    channel: user?.channelId,
                    ts: user?.postedTimestamp,
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
        } else {
            console.log('>> Error saving survey answers:')
            console.log('survey:', surveyId)
            console.log('user:', user.id)
            console.log('answer01:', answer01)
            console.log('answer02:', answer02)
        }
    })
}
