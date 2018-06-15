/*
*2018-06-01
*by wangyingyu
* QQ635913935
*/
//定义当前是否大写的状态
var CapsLockValue=0,
    check;
//存储当前内容
var tempSt = '',
    tempEt = '';
//给输入的密码框添加新值
var zn_en = 'en';

var config={
    spaceBehavesLikeTab: true,
    leftRightIntoCmdGoes: 'up',
    restrictMismatchedBrackets: true,
    sumStartsWithNEquals: true,
    supSubsRequireOperand: true,
    autoSubscriptNumerals: true,
    handlers: {
        edit: function(){

        },
    },
    restrictMismatchedBrackets: true
};

var MQ = MathQuill.getInterface(2);
var mathField = MQ.MathField($("#txt_latex")[0], config);

//输入效果
function addValue(newValue) {
    mathField.focus();
    if($(".change_btns.active").attr("data-type") == "zhongwen" && /[a-zA-Z]/.test(newValue)){
        znValue(newValue);
        return false;
    }
    CapsLockValue==0?'':newValue= newValue.toUpperCase();
    if($.trim($("#txt_latex").text()) == ''){
        mathField.latex(newValue);
    }else {
        mathField.write(newValue);
    }
}

//查找中文字符
var _text = '';
function znValue(obj) {
    _text ? _text += obj : _text=obj;
    console.log(_text)
    var lists =zn_lists[_text];
    if(!lists){
        _text=obj;
        lists =zn_lists[_text];
        console.log(_text)
    }
    var str = '<div class="zn_box clearfix"><span>'+_text+'</span><div class="zn_scroll"><ul class="clearfix">';
    for (var i=0;i<lists.length;i++){
        str+='<li>'+zn_lists[_text][i]+'</li>'
    }
    str+='</ul></div>';
    if(lists.length>=13){
        str+='<a href="javascript:;" class="zn_btn"></a>';
    }
    str+='</div>';
    $(".zn_box").remove();
    $(".input_con").append(str);

}
//清空
function clearValue() {
    mathField.latex('')
    _text = '';
    $(".zn_box").remove();
}
//实现BackSpace键的功能
function backspace() {
    if(zn_en == 'zn' && _text.length>=1){
        if(_text.length == 1){
            _text = '';
            $(".zn_box").remove();
        }else {
            _text=_text.substring(0,_text.length-1);
            znValue(_text);
        }
        return false;
    }
    mathField.keystroke('Backspace')
}
//切换功能
function changePanl(oj){
    mathField.focus();
    if(oj =='zhongwen'){
        zn_en = 'zn';
        if(CapsLockValue ==1){
            setCapsLock($("input[value=小写]"))
        }
        $("input[value=韵母]").closest("td").show();
        $("input[value=小写]").closest("td").hide();
        $("input[value=大写]").closest("td").hide();
        $(".zimu").siblings(".c_panel").hide();
        $(".zimu").show();
    }else {
        zn_en = 'en';
        $("input[value=韵母]").closest("td").hide();
        $("input[value=小写]").closest("td").show();
        $("input[value=大写]").closest("td").show();
        _text='';
    }
    $("."+oj).siblings(".c_panel").hide();
    $("."+oj).show();

}
//设置是否大写的值
function setCapsLock(o) {
    if (CapsLockValue==0){
        CapsLockValue=1;
        $(o).val("小写");
        $.each($(".i_button_zm"),function(b, c) {
            $(c).val($(c).val().toUpperCase());
        });
    }else{
        CapsLockValue=0;
        $(o).val("大写");
        $.each($(".i_button_zm"),function(b, c) {
            $(c).val($(c).val().toLowerCase());
        });
    }
    _text='';
    $(".zn_box").remove();
    $("input[value=英文]").val("中文");
}

$(function(){
    changePanl("zimu");
    $(document).on("click",".zn_btn",function () {
        $(this).toggleClass('on');
        if($(this).hasClass('on')){
            $('.zn_box').addClass('on');
            $(".zn_scroll ul").slimScroll({
                height:'200px'
            })
        }else {
            $('.zn_box').removeClass('on');
        }

    })
    $(document).on("click",".zn_box li",function () {
        mathField.typedText($(this).text())
        $(".zn_box").remove();
    })

    $(".addlatex").on("click",function () {
        $(".temp_input").text(mathField.latex())
        MQ.StaticMath($(".temp_input")[0])
        $(".input_con").slideUp(function () {
            $(".input_box").hide()
            $("#txt_Search").val("")
        });
    })
    $(".btn_ok").on("click",function () {
        $(".input_box").hide();
        $(".temp_input").text($("#txt_Search").val())
        $("#txt_Search").val("")

    })

    //开启键盘
    $(".answer_lists p").on("click",function () {
        mathField.latex('');
        $(".answer_lists p").removeClass("temp_input")
        $(".input_box").show();
        $(".input_con").slideDown();
        $(this).addClass("temp_input");
        if($.trim($(this).text()) !=''){
            var el = $(this).find('.mq-selectable').text();
            if(el){
                var txt =el.substr(0,el.length-1).substr(1,el.length-1);
            }else {
                var txt = $(this).text();
            }
            mathField.latex(txt)
        }
    })
    //关闭
    $(".close_keyborad").on("click",function () {
        $(".input_con").slideUp(function () {
            $(".input_box").hide()
            $("#txt_Search").val("")
        });
    })
    //切换功能
    $(".change_btns").on("click",function () {
        if($(this).text() == '手写'){
            alert("开发中。。。")
            return false;
        }
        $(this).addClass("active").siblings().removeClass("active")
        changePanl($(this).attr("data-type"));
    })

    MQ.StaticMath($(".answer_lists")[0])
})



