const db = require('../../models')
const { survey: Survey, question: Question } = db

module.exports = (slackApp) => {
    slackApp.action('actionId-0', async ({ body, ack, say }) => {
        await ack()

        const result = await Survey.findOne({
            where: { name: 'Monday survey' },
            include: Question,
        })

        const blocks2 = []
        const questions = result.questions
        const surveyName = result.name
        for (let index = 0; index < questions.length; index++) {
            const element = await questions[index].dataValues
            const bl = {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: element.question,
                },
                accessory: {
                    type: 'radio_buttons',
                    options: [
                        {
                            text: {
                                type: 'mrkdwn',
                                text: '*Amazing, in flow*',
                            },
                            description: {
                                type: 'mrkdwn',
                                text: 'Deep mental clarity, calm and focus',
                            },
                            value: '1',
                        },
                        {
                            text: {
                                type: 'mrkdwn',
                                text: '*Great, high energy*',
                            },
                            description: {
                                type: 'mrkdwn',
                                text: 'Thoughts flow, deep work is achievable',
                            },
                            value: '2',
                        },
                        {
                            text: {
                                type: 'mrkdwn',
                                text: '*Good, some stress*',
                            },
                            description: {
                                type: 'mrkdwn',
                                text: 'Making progress, pushing through challenges',
                            },
                            value: '3',
                        },
                        {
                            text: {
                                type: 'mrkdwn',
                                text: '*Alright, difficulty focusing*',
                            },
                            description: {
                                type: 'mrkdwn',
                                text: 'Maintaining progess',
                            },
                            value: '4',
                        },
                        {
                            text: {
                                type: 'mrkdwn',
                                text: '*Low, unable to focus*',
                            },
                            description: {
                                type: 'mrkdwn',
                                text: 'Tired, running out of battery',
                            },
                            value: '5',
                        },
                        {
                            text: {
                                type: 'mrkdwn',
                                text: '*Exhausted*',
                            },
                            description: {
                                type: 'mrkdwn',
                                text: 'In need of a break or a change',
                            },
                            value: '6',
                        },
                    ],
                    action_id: `${element.id}-action`,
                },
            }
            blocks2.push(bl)
        }

        try {
            const result = await slackApp.client.views.open({
                trigger_id: body.trigger_id,
                view: {
                    type: 'modal',
                    callback_id: 'view_1',
                    title: {
                        type: 'plain_text',
                        text: surveyName,
                    },
                    blocks: blocks2,
                    submit: {
                        type: 'plain_text',
                        text: 'Submit',
                    },
                },
            })
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    })
}
