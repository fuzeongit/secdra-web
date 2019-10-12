/**
 * http请求的工具类
 *
 * @author fjj
 */
import Cookies from "js-cookie"
import axios from "axios"
import qs from "qs"
import { Result } from "../model"
axios.defaults.baseURL = process.env.baseUrl
export default {
  /**
   * get 请求
   * @param {string} url
   * @param params
   * @returns {Promise<>}
   */
  async get(url, params) {
    let result = null
    try {
      const response = await axios.get(url, {
        params
      })
      this._handleToken(response)
      result = response.data
    } catch (e) {
      result = await new Result(500, e, "服务器错误")
    } finally {
    }
    return result
  },

  /**
   * post 请求
   * @param {string} url
   * @param body
   * @param params
   * @returns {Promise<>}
   */
  async post(url, body, params) {
    let result = null
    try {
      const response = await axios.post(
        url,
        qs.stringify(body, {
          arrayFormat: "repeat"
        }),
        {
          params
        }
      )
      this._handleToken(response)
      result = response.data
    } catch (e) {
      result = await new Result(500, e, "服务器错误")
    } finally {
    }
    return result
  },

  _getCookieToken() {
    if (window.$nuxt.$store.state.user.token) {
      return window.$nuxt.$store.state.user.token
    } else {
      try {
        return Cookies.get("token")
      } catch (e) {
        return null
      }
    }
  },
  _handleToken(response = {}) {
    const headers = response.headers || {}
    if (headers.token) {
      Cookies.set("token", headers.token, { expires: 30 })
    }
    if (response.data.status === 401) {
      Cookies.remove("token")
      try {
        window.$nuxt.$router.replace(`/login?r=${window.$nuxt.$route.fullPath}`)
      } catch (e) {
        window.location.href = `/login?r=${
          document.location.toString().split(window.location.host)[1]
        }`
      }
    }
  }
}
