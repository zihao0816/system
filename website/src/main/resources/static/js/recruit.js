for(var i=0;i<$('.productManager').length;i++){
    (
        function(j){
            $('.manager_top_right').eq(j).on('click',function(){
                if($('.productManager').eq(j).find('.manage_text').css('display')=="none"){
                    $('.productManager').eq(j).find('.manage_text').css({'display':'block'})
                    $('.productManager').eq(j).find('.manager_top_right img').attr('src','../img/zk_icon@3x.png');
                }else{
                    $('.productManager').eq(j).find('.manage_text').css({'display':'none'});
                    $('.productManager').eq(j).find('.manager_top_right img').attr('src','../img/sq_icon@3x.png');
                }
            })
        }
    )(i)

}