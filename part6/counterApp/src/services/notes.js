import axios from 'axios'

const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const createNew = async (content) => {
    const object = {content, important: false}
    const response = await axios.post(baseUrl, object)
    return response.data
}

const changeImportance = async (object) => {
    const response = await axios.put(`${baseUrl}/${object.id}`, {...object, important: !object.important})
    return response.data
}

export default {getAll, createNew, changeImportance}