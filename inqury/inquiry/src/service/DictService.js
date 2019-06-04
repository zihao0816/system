/**
 * Created by lifei on 2019/1/8.
 */
import {doRequest} from '@/api/http'
import request from '@/api/request'

class DictService {

  //列出指定的字典列表
  listDictItems(itemcode) {
    return request({
      url:'/api/datadictionarydetail/getListByKey',
      data:{sortcode:itemcode},
      method:'post'
    });
  }


}

export default  new DictService();
