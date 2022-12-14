import {axiosAuth} from './axios'

export const getChatConversation = (id) => {
    return axiosAuth.get(`/chat/${id}`);
}

export const getMessagesForCurrentChat = (id,currentChatId) => {
    return axiosAuth.get(`/chat/${id}/${currentChatId}`);
}

export const postMessage = (data) => {
    return axiosAuth.post('/chat',data);
}