var config = {
    // 正则表达式
    regexString:{
        email:new RegExp("^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$"),
        phone:new RegExp("^1[3|4|5|6|7|8|9][0-9]{9}$"),
        chinese:new RegExp("^[\u4e00-\u9fa5]{0,}$")
    },
    // 数据请求url
    ajaxUrls: {
        getIndexData: "/website/artifacts/getMedalDataByRandom/{num}",
        // TopicAbout
        getTopicAboutData: "/website/topics",
        // topics
        getTopicsData:"/website/topics",
        // search
        searchByKeywords:'/website/search/searchByKeywords',
        suggestKeyWords: '/website/search/suggestKeyWords',
        suggestKeyWordsWithJobtag: '/website/search/suggestKeyWordsWithJobtag',
        searchByKeywordsAndJobtag: '/website/search/searchByKeywordsAndJobtag',
        searchByUsername:'/website/users/searchByUsername',
        searchByEmail:'/website/users/searchByEmail',
        searchArtifactsByNameOrTermName:'/website/search/searchArtifactsByNameOrTermName',
        searchComment:'/website/artifactComment/searchComment',
        // workFolder
        getTopicAndArtifactById:'/website/topics/getTopicAndArtifactById',
        // uploadWork
        getUrlSignature:'/getUrlSignature',
        getSTSSignature:'/getSTSSignature/:type',
        deleteAliossFile:"/deleteAliossFile/:fileType",
        // artifacts
        getArtifacts:'/website/artifacts',
        getArtifactsWithId:'/website/artifacts/:id',
        getPersonalJob: "/website/artifacts/getPersonalJob", //获取我的作品集
        getPersonalJobByUserId: "/website/artifacts/getPersonalJobByUserId", //获取别人的作品集
        updateVisibleById: "/website/artifacts/updateVisibleById/:id",
        // user
        getUserData:"/website/users",
        updatePwdWithEmailAndActiveCode:'/website/users/updatePwdWithEmailAndActiveCode',
        updatePwdWithMobile:"/website/users/updatePwdWithMobile",
        updateUserRole:'/website/users/updateUserRole',
        getCaptcha:'/getCaptcha',
        checkCaptcha:'/checkCaptcha',
        createWxUser:"/website/users/createWxUser",
        bindWeixinInfoByEmail:"/website/users/bindWeixinInfoByEmail",
        searchUserInfoByKeyword:"/website/users/searchUserInfoByKeyword",
        //searchEngine
        transterInsertDataToES:'/website/artifacts/transterInsertDataToES',
        transterUpdateDataToES:'/website/artifacts/transterUpdateDataToES',
        //手机短信接口
        sendMessage:"/website/sms/sendMessage?mobile=",
        vertifySms:"/website/sms/vertifySms"
    },
    viewUrl:{
        workFolder:'/workFolder/:id',
        uploadWork:'/uploadWork/1?topicId=:id',
        topicsUpdate:'/topicsUpdate/:id'
    },
    default_profile: "../public/images/default_profile.jpg"
}
