const moment = require('moment')
const db = require('../../models')
const { survey: Survey, question: Question } = db

module.exports = (slackApp) => {
    slackApp.action('actionId-0', async ({ body, ack, say }) => {
        await ack()

        const timestamp = body?.message?.ts
        const userName = body?.user?.username

        const surveyPostingDate = Math.floor(timestamp * 1000)

        const inputDate = moment(surveyPostingDate) || moment()

        const relatedSurvey = getSurveyForDate(inputDate)
        const survey = await Survey.findOne({
            where: { name: relatedSurvey },
            include: Question,
        })

        if (relatedSurvey) {
            const secondSurveyQuestion = async () => {
                const questions = survey.questions
                for (let index = 0; index < questions.length; index++) {
                    const element = await questions[index].dataValues
                    return {
                        type: 'input',
                        block_id: 'q02', //change this when one survey has both questions
                        element: {
                            type: 'static_select',
                            placeholder: {
                                type: 'plain_text',
                                text: 'Select a feeling',
                                emoji: true,
                            },
                            options: [
                                {
                                    text: {
                                        type: 'plain_text',
                                        text: 'Amazing',
                                        emoji: true,
                                    },
                                    value: '10',
                                },
                                {
                                    text: {
                                        type: 'plain_text',
                                        text: 'Great',
                                        emoji: true,
                                    },
                                    value: '8',
                                },
                                {
                                    text: {
                                        type: 'plain_text',
                                        text: 'Good',
                                        emoji: true,
                                    },
                                    value: '6',
                                },
                                {
                                    text: {
                                        type: 'plain_text',
                                        text: 'Alright',
                                        emoji: true,
                                    },
                                    value: '4',
                                },
                                {
                                    text: {
                                        type: 'plain_text',
                                        text: 'Low',
                                        emoji: true,
                                    },
                                    value: '2',
                                },
                                {
                                    text: {
                                        type: 'plain_text',
                                        text: 'Bad',
                                        emoji: true,
                                    },
                                    value: '0',
                                },
                            ],
                            action_id: 'q02', //change this when one survey has both questions
                        },
                        label: {
                            type: 'plain_text',
                            text: element.question,
                            emoji: true,
                        },
                    }
                }
            }

            const mainBlocksContent = [
                {
                    type: 'section',
                    text: {
                        type: 'plain_text',
                        text: `Hey ${userName} :wave: !`,
                        emoji: true,
                    },
                },
                {
                    type: 'divider',
                },
                {
                    type: 'input',
                    block_id: 'q01',
                    element: {
                        type: 'static_select',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Select a feeling',
                            emoji: true,
                        },
                        options: [
                            {
                                text: {
                                    type: 'plain_text',
                                    text: 'Focused and Energized - High energy and clear thinking',
                                    emoji: true,
                                },
                                value: '10',
                            },
                            {
                                text: {
                                    type: 'plain_text',
                                    text: 'Productive and Steady - Positive mood and making steady progress',
                                    emoji: true,
                                },
                                value: '7.5',
                            },
                            {
                                text: {
                                    type: 'plain_text',
                                    text: 'Managing Tasks - Balancing tasks with some challenges',
                                    emoji: true,
                                },
                                value: '5',
                            },
                            {
                                text: {
                                    type: 'plain_text',
                                    text: 'Tired or Distracted - Low energy and difficulty concentrating',
                                    emoji: true,
                                },
                                value: '2.5',
                            },
                            {
                                text: {
                                    type: 'plain_text',
                                    text: 'Overwhelmed or Fatigued - Feeling stressed and needing rest or support',
                                    emoji: true,
                                },
                                value: '0',
                            },
                        ],
                        action_id: 'q01',
                    },
                    label: {
                        type: 'plain_text',
                        text: "We'd love to hear from you, how are you feeling today?",
                        emoji: true,
                    },
                },
                {
                    type: 'divider',
                },
                await secondSurveyQuestion(),
            ]

            try {
                const surrveyId = survey.id.toString()
                const result = await slackApp.client.views.open({
                    trigger_id: body.trigger_id,
                    view: {
                        type: 'modal',
                        callback_id: 'view_1',
                        title: {
                            type: 'plain_text',
                            text: 'Anonymous check-in 😄',
                            emoji: true,
                        },
                        blocks: mainBlocksContent,
                        submit: {
                            type: 'plain_text',
                            text: 'Submit',
                        },
                        close: {
                            type: 'plain_text',
                            text: 'Cancel',
                            emoji: true,
                        },
                        private_metadata: surrveyId,
                    },
                })
                console.log(result)
            } catch (error) {
                console.log('modal open issue', error)
            }
        } else {
            console.log('This is not a working day')
        }
    })
}

// Function to determine the message for a given date
function getSurveyForDate(date) {
    const weekNumber = date.isoWeek() // Get the ISO week number for the date
    const dayOfWeek = date.day() // Get the day of the week (0 = Sunday, ..., 6 = Saturday)

    // Ensure the day is within the working week (Monday = 1, ..., Friday = 5)
    if (dayOfWeek < 1 || dayOfWeek > 5) {
        return null
    }

    // Calculate the week in the 4-week cycle
    const weekInCycle = weekNumber % 4 === 0 ? 4 : weekNumber % 4

    // Get the day name
    const dayName = date.format('dddd')

    // Determine the corresponding survey
    const survey = `${dayName} week ${weekInCycle}`

    return survey
}
