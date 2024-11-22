const db = require('../../models')
const { WebClient } = require('@slack/web-api')
const SlackService = require('../../service/slack.service')
const { Op } = require('sequelize')

const {
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

        const workspaceUser = await WorkspaceUser.findOne({
            where: { userId: body?.user?.id },
        })

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    {
                        workspaceUserIds: {
                            [Op.contains]: [workspaceUser.id], // For array cases
                        },
                    },
                    {
                        workspaceUserIds: workspaceUser.id, // For single value cases
                    },
                ],
            },
        })

        if (user === null) {
            console.log('>> Error while finding user: ')
            return
        }

        const surveyId = payload?.private_metadata
        if (surveyId === undefined) {
            console.log('>> Error: No survey ID is provided')
            return
        }

        const answer01 =
            payload?.state?.values?.q01?.q01?.selected_option?.value
        const answer02 =
            payload?.state?.values?.q02?.q02?.selected_option?.value
        if (answer01 === undefined || answer02 === undefined) {
            console.log('>> Error: No answer is provided')
            return
        }

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

        if (workspaceUser === null) {
            console.log('>> Error while finding workspace user: ')
            return
        }

        try {
            let token
            await slackService
                .authorize(workspaceUser?.teamId)
                .then((res) => {
                    token = res.botToken
                })
                .catch((err) => {
                    throw new Error('Failed authorize token', err)
                })
            await webClient.chat.update({
                token: token,
                channel: workspaceUser?.channelId,
                ts: workspaceUser?.postedTimestamp,
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
