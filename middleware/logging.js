module.exports = async ({ payload, next }) => {
    try {
        console.log('Incoming request:', payload)
        await next()
    } catch (error) {
        console.error('Error in middleware:', error)
    }
}
