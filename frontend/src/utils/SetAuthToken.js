import axios from 'axios';

const setAuthToken = token => {
    if (token) {
        // Gelen token varsa, tüm axios isteklerinin header'ına ekle
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        // Token yoksa (çıkış yapıldıysa), header'dan kaldır
        delete axios.defaults.headers.common['x-auth-token'];
    }
};

export default setAuthToken;