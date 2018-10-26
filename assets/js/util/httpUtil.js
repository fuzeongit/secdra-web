/**
 * http请求的工具类
 *
 * @author fjj
 */

import config from "../config/config"
import {Result} from "../model/base"
import axios from 'axios'
import qs from 'qs'
// import * as NProgress from "nprogress";
export default {
  /**
   * get 请求
   * @param {string} url
   * @param params
   * @returns {Promise<>}
   */
  async get(url, params) {
    // NProgress.start();
    let result = null;
    try {
      result = await axios.get(config.host + url, {
        params: params,
      });
    } catch (e) {
      result = await new Result(500, e, "服务器错误");
    } finally {

    }
    return result;
  },

  /**
   * post 请求
   * @param {string} url
   * @param body
   * @param params
   * @returns {Promise<>}
   */
  async post(url, body, params) {
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.withCredentials=true;
    // NProgress.start();
    let result = null;
    try {
      let response = await axios.post(config.host + url, qs.stringify(body), {
        params: params
      });
      console.log(response);
      result = response.data;
    } catch (e) {
      result = await new Result(500, e, "服务器错误");
    } finally {

    }
    return result;
  }
}
