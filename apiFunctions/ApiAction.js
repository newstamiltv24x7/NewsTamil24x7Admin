import axios from "axios";
import { AppHeader, OpenAIHeaders, imgeUploadHeaders } from "./AppHeader";
const SOCIAL_TOKEN = process.env.NEXT_PUBLIC_SOCIAL_POST_TOKEN;
const PAGE_ID = process.env.NEXT_PUBLIC_FB_PAGE_ID;
// ---------------------------------------------------------------

export const OpenAIApiForConversion = async (body) => {
  return await axios
    .post(`https://api.openai.com/v1/chat/completions`, body, {
      headers: OpenAIHeaders,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

// ----------------------------------------------------------------

export const LoginApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/sign_in`, body)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const checkMailApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/check_email`, body)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const forgotPasswordApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/forgot_password`, body)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const changePasswordApi = async (body, token) => {

  const AppHeaders ={
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  }

  return await axios
    .post(`/api/v1/admin/change_password`, body, {
      headers: AppHeaders 
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const userChangePassword = async (body) => {
  return await axios
    .post(`/api/v1/admin/change_password`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getTranslateApi = async (body) => {
  return await axios
    .get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ta&tl=en&dt=t&q=${body}`
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

// ---- Masters API ------------

export const getCategoryListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/master/categories/list`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getAllCategoryListApi = async (body) => {

  if(body){
    return await axios
    .get(`/api/v1/admin/master/categories/list?c_category_id=${body}`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
  }else{
    return await axios
    .get(`/api/v1/admin/master/categories/list`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
  }

  
};


export const getAllCountryListApi = async () => {
  return await axios
    .get(`/api/v1/admin/master/countries`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getPublishOptionApi = async () => {
  return await axios
    .get(`/api/v1/admin/master/publish_options`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getHruleData = async () => {
  return await axios
    .get(`/api/v1/admin/h_rules/list`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getAllStateListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/master/states`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getAllCityListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/master/city`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const allUserListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/list_user`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getAllUserListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/list_user`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getMethodAllUserListApi = async () => {
  return await axios
    .get(`/api/v1/admin/list_user`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const addCategoryListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/master/categories/add`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteCategoryListApi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/master/categories?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const categoryOrderApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/master/menu_order_change`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getAllyoutubeLinkApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/urls/list`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteYoutubeThumbApi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/urls/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const addYouTubeLinkApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/urls/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const youtubeStreamOrderApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/urls/update_by_order`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getLiveStreamCategoryApi = async () => {
  return await axios
    .get(`/api/v1/admin/live_stream_category/list`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

// ----- Story API --------------

export const getAllStoriesListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/story/list`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const createNewStoryApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/story/add`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteStoryApi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/story/delete?id=${body}`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deletePermanentStoryApi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/story/deleted?id=${body}`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getParticularStoryApi = async (body) => {
  return await axios
    .get(`/api/v1/admin/story/list?Id=${body}`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const imageUploadApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/file_upload`, body, { headers: imgeUploadHeaders })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const imageDeleteApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/file_delete`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

// ----------------------------------------------------------

export const getAllAdsListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/advertisement/list`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const createAdvertisementApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/advertisement/add`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const editAdvertisementApi = async (body) => {
  return await axios
    .get(`/api/v1/admin/advertisement/list?id=${body}`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteAdvertisementApi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/advertisement/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

// ------------ Web Stories -------------------------

export const getAllWebSToriesApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/web_stories/list`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const addWebStoryApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/web_stories/add`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteWebStoryApi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/web_stories/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

// ------------ Listicles ------------------------------------

export const getAllListiclesListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/listicles/list`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const createListiclesApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/listicles/add`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getParticularListiclesApi = async (body) => {
  return await axios
    .get(`/api/v1/admin/listicles/list?id=${body}`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteListicleApi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/listicles/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

// ------------------- LIVE BLOG ---------------------

export const getAllLiveBlogListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/live_blog/list`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const addLiveBlogApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/live_blog/add`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getParticularBlogApi = async (body) => {
  return await axios
    .get(`/api/v1/admin/live_blog/list?id=${body}`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteLiveBlogApi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/live_blog/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const userPrivilegeApi = async (body) => {
  return await axios
    .get(`/api/v1/admin/role/list`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const userPrivilegeUserListApi = async () => {
  return await axios
    .get(`/api/v1/admin/user_privileges/list`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const userRoleMenuAPi = async () => {
  return await axios
    .post(
      `/api/v1/admin/menus/list`,
      { c_search_term: "" },
      {
        headers: AppHeader,
      }
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const addUserPrivilegeAPi = async (body) => {
  return await axios
    .post(`/api/v1/admin/user_privileges/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteUserRoleAPI = async (body) => {
  return await axios
    .delete(`/api/v1/admin/user_privileges/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteUserAPI = async (body) => {
  return await axios
    .delete(`/api/v1/admin/user/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};
export const deleteWebConfigTagsAPI = async (body) => {
  return await axios
    .delete(`/api/v1/admin/tags/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const craeteUserApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/create_user`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const craeteAddTxtApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/ads_txt/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const craeteRobotsTxtApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/robots_txt/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getAddTxtWebApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/ads_txt/list`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const createWebConfigTagsApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/tags/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getRobotsTxtWebApi = async () => {
  return await axios
    .get(`/api/v1/admin/robots_txt/list`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getWebAppConfigTags = async (body) => {
  return await axios
    .post(`/api/v1/admin/tags/list`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getAllTagsList = async () => {
  return await axios
    .get(`/api/v1/admin/tags/list`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getRedirectUrlList = async (body) => {
  return await axios
    .post(`/api/v1/admin/redirect_url/list`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const createRedirectUrl = async (body) => {
  return await axios
    .post(`/api/v1/admin/redirect_url/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const createNewForm = async (body) => {
  return await axios
    .post(`/api/v1/admin/form/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getSeoSetupListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/seo_category/list`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteRedirectUrl = async (body) => {
  return await axios
    .delete(`/api/v1/admin/redirect_url/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getSeoListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/seo_setup/list`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getAllSeoListApi = async () => {
  return await axios
    .get(`/api/v1/admin/seo_setup/list`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const createSeoSetupApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/seo_setup/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getStaticPageList = async (body) => {
  return await axios
    .post(`/api/v1/admin/static_page/list`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const addStaticPageData = async (body) => {
  return await axios
    .post(`/api/v1/admin/static_page/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteStaticListAPi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/static_page/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteSeoListAPi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/seo_category/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getTrendingTag = async () => {
  return await axios
    .get(`/api/v1/admin/trending_tags/list`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const addTrendingTag = async (body) => {
  return await axios
    .post(`/api/v1/admin/trending_tags/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

// export const sendNotification = async (body) => {
//   return await axios
//     .post(`/api/v1/admin/notification/send`, body, {
//       headers: AppHeader,
//     })
//     .then((res) => {
//       return res.data;
//     })
//     .catch((err) => {
//       return err;
//     });
// };
export const sendNotification = async (body) => {
  return await axios
    .post(`/api/v1/admin/send-notification`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getSocialHandlesList = async (body) => {
  return await axios
    .post(`/api/v1/admin/social_handle_page/list`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getAllSocialHandlesList = async () => {
  return await axios
    .get(`/api/v1/admin/social_handle_page/list`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const addSocialHandlePost = async (body) => {
  return await axios
    .post(`/api/v1/admin/social_handle_page/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const createSocialCategory = async (body) => {
  return await axios
    .post(`/api/v1/admin/social_handle_category/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const createHrules = async (body) => {
  return await axios
    .post(`/api/v1/admin/h_rules/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getFormPageList = async (body) => {
  return await axios
    .post(`/api/v1/admin/form/list`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getEmailTemplateList = async (body) => {
  return await axios
    .post(`/api/v1/admin/email_template/list`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const createEmailTemplate = async (body) => {
  return await axios
    .post(`/api/v1/admin/email_template/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getCollectionList = async (body) => {
  return await axios
    .post(`/api/v1/admin/collections/list`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const createCollectionList = async (body) => {
  return await axios
    .post(`/api/v1/admin/collections/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getSocialMediaList = async () => {
  return await axios
    .get(`/api/v1/admin/social_handle_category/list`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteSocialList = async (body) => {
  return await axios
    .delete(`/api/v1/admin/social_handle_page/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteEmailTemplate = async (body) => {
  return await axios
    .delete(`/api/v1/admin/email_template/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteSocialMedia = async (body) => {
  return await axios
    .delete(`/api/v1/admin/social_handle_category/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteForm = async (body) => {
  return await axios
    .delete(`/api/v1/admin/form/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteCollection = async (body) => {
  return await axios
    .delete(`/api/v1/admin/collections/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getAllWebComponentsCategoryListApi = async () => {
  return await axios
    .get(`/api/v1/admin/web_component_category/list`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const newsroomOrderApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/story/story_order_change`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const addSeoCategoryApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/seo_category/add`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getSideBarMenu = async () => {
  return await axios
    .get(`/api/v1/admin/side_bar_menu/list`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getSideBarMenus = async () => {
  return await axios
    .get(`/api/v1/admin/side_bar_menu/lists`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};


export const getAllSideBarMenu = async () => {
  return await axios
    .get(`/api/v1/admin/side_bar_menu/get_all_list`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};
export const imageGalleryList = async (body) => {
  return await axios
    .post(`/api/v1/admin/media_galary/list`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteImageGalleryImg = async (id, name) => {
  return await axios
    .delete(`/api/v1/admin/media_galary/delete?id=${id}&c_file=${name}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const GetSubscibersList = async () => {
  return await axios
    .get(`/api/v1/admin/subscriber/list`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const GetStaticPagesListMenu = async () => {
  return await axios
    .get(`/api/v1/admin/static_menu_page/list`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

// export const newsroomOrderApi = async (body) => {
//   return await axios
//     .post(`/api/v1/admin/story/story_order_change`, body, {
//       headers: AppHeader,
//     })
//     .then((res) => {
//       return res.data;
//     })
//     .catch((err) => {
//       return err;
//     });
// };

export const sharePostOnFb = async (text, postUrl) => {
  return await axios
    .post(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/feed?message=${text}&access_token=${SOCIAL_TOKEN}&link=${postUrl}`,
      { headers: AppHeader }
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

// ------------ Web Stories -------------------------

export const getAllCardsApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/cards/list`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const addCardsApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/cards/add`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteCardsApi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/cards/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};


// ------------ Polls -------------------------

export const getAllPollsApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/poll/list`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const addPollsApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/poll/add`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deletePollsApi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/poll/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};
export const craeteControlApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/control/add`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getControlListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/control/list`, body, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

// ------------ Photos ------------------------------------

export const getAllPhotosListApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/photos/list`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const createPhotosApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/photos/add`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const getParticularPhotosApi = async (body) => {
  return await axios
    .get(`/api/v1/admin/photos/list?id=${body}`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deletePhotosApi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/photos/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

// ------------ Web Stories -------------------------

export const getAllCommentsApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/user_comments/list`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};


export const getAllCommentsApiList = async (body) => {
  return await axios
    .get(`/api/v1/admin/user_comments/list?id=${body}`, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const addCommentsApi = async (body) => {
  return await axios
    .post(`/api/v1/admin/user_comments/add`, body, { headers: AppHeader })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteCommentsApi = async (body) => {
  return await axios
    .delete(`/api/v1/admin/user_comments/delete?id=${body}`, {
      headers: AppHeader,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};