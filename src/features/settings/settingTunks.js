import api from '@/core/api';
import { ADMIN_SETTINGS, BASE_URL } from '@/core/consts';
import axios from 'axios';
import { setSettingData } from './settingSlice';


export const getSettingsForAll = async(dispatch)=>{
    try {
        const response = await axios.get(`${BASE_URL}${ADMIN_SETTINGS.GET}`);
            dispatch(setSettingData(response.data.data));
        
    } catch (error) {
            console.error('Failed to fetch settings:', error);

    }
}