import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userInfo: {}, //患者信息
        common: {}, //配置信息
        doctorInfo: {}, //当前聊天的医生信息
        Lock: {}, //锁的管理器
        websocketdosome: {}, //特殊执行逻辑方法
        sockettime: null, //获取最近一次获取websocket消息的时间
        socketstate: 2, // websocket打开状态 1=打开 2=关闭
        todoctorindex: {}, //序列号右边的值
        redistribute: {}, //重复发送数据的线程管理
        AllOfValue: {}, //页面相互传值仓库
        sun:{},
        fileUrl: '/api/StaticFile/fastdfsLocalURL/', //临时文件前缀
        tabIndex: 'immsg',
        scrollerTop: 0,
        doctorList: [],
        pagination: 1,
        total: 0,
        doctorId: '',    //门诊系统-医生id
        clinicId: '',     //门诊系统-门诊id
        origin: '',       //门诊系统-标识
        url: '',
        openid: '',
        price: '',        //门诊系统-坐诊费
        free: false,
        addressId:'',
        addressList:{}//编辑地址跳转

    }
})