import request from "../../utils/requestAxios";
import {REQUEST_DOMAIN_WORK_BENCH} from "../../globalset/js/constant";

export async function getUserBoxs(){
    return request({
        url: `${REQUEST_DOMAIN_WORK_BENCH}/simple/user/box`,
        method: 'GET'
      });
}

export async function getAllBoxs(){
  return request({
      url: `${REQUEST_DOMAIN_WORK_BENCH}/simple/box`,
      method: 'GET'
      
    });
}

export async function boxSet(data){
  return request({
      url: `${REQUEST_DOMAIN_WORK_BENCH}/simple/user/box/set`,
      method: 'POST',
      data:{simple_model_id:data.id}
    });
}

export async function boxCancel(data){
  return request({
      url: `${REQUEST_DOMAIN_WORK_BENCH}/simple/user/box/cancel`,
      method: 'PUT',
      data:{simple_model_id:data.id}
    });
}
