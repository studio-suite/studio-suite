import axios from 'axios'


const state = () => {
    return {
        list: []
    }
}

const getters = {
    all: function(st){
        return st.list
    }
}
const getClass = `
  query getClass($id: ID!){
    getClass(id: $id){
      id
      title
      excerpt
      content
      image
      created
      updated
      locationId
      roomId
      capacity
      age
      status
      instructorsIds
      classTypesIds
      seasonsIds
      language{
          i
          l
      }
      schedule{
          days{
              d
              i{
                  s
                  e
              }
          }
          empty
          specific{
              d
              i{
                  s
                  e
              }
          }
      }
      price
      color
      slug
      dripTags{
          trigger
          action
          tags
      }
      redirect
      event
      zoomId
    }
  }
`;
const actions = {
  get: async function ({commit}, id) {
    try {
      let operation = {
        query: getClass,
        operationName: 'getClass',
        variables: {
          id: id
        }
      };
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VUE_APP_APPSYNC_KEY,
      }
      let list = await axios({
        method: 'POST',
        url: process.env.VUE_APP_APPSYNC_URL,
        data: JSON.stringify(operation),
        headers: headers
      })
      commit('SET', list.data.data.getClass)

    } catch (e) {
      console.log(e)
      await axios.get(`${process.env.VUE_APP_API_BASE}/get-class?tenantId=${id}`).then(function (r) {
        commit('SET', r.data)
      }).catch(function (ee) {
        console.log(ee)
      })
    }
  }
}

const mutations = {
    SET: function (st, s) {
        st.list.push(s)
    }
}

export default {
    namespaced: true,
    actions,
    state,
    getters,
    mutations
}
