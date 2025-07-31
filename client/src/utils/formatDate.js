const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }
    return date.toLocaleString('en-US', options)
}

export default formatDate