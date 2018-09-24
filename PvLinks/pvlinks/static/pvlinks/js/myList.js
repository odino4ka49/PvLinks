PVLINKS.namespace("PVLINKS.myList");
PVLINKS.myList = function(model,div,listname,additionalFunction){
    var model = model,
        div = div,
        searchline,
        list,
        data,
        showdata,
        clusterize,
        listname = listname,
        additionalFunction = additionalFunction;


    function initClusterList(lidata){
        clusterize = new Clusterize({
            rows: lidata,
            scrollId: listname+'scrollArea',
            contentId: listname+'contentArea'
        })
    };

    function updateClusterList(lidata){
        clusterize.update(lidata);
    };

    function initHtml(){
        searchline = document.createElement("input"),
        list = document.createElement("div");
        list.className = "clusterize-scroll";
        list.setAttribute("id", listname+"scrollArea");
        list.innerHTML = '<ul id="'+listname+'contentArea" class="clusterize-content"><li class="clusterize-no-data">Loading data…</li></ul>';
        div.append(searchline,list);
        if(showdata){
            initClusterList(dataToLi(showdata));
        }
        $(searchline).on("input",checkInput);
        list.onclick = function(e){
            e = e || event;
            e.stopPropagation();
            e.preventDefault();
            var target = e.target || e.srcElement;
            if(!$(target).hasClass("selected")){
                $(list).children("ul").children("li").removeClass("selected");
                $(target).addClass("selected");
            }
            else {
                $(target).removeClass("selected");
            }
            additionalFunction(listname,target);
        }
    };

    function dataToLi(startdata){
        var lidata = [];
        startdata.forEach(function(item){
            lidata.push('<li>'+item.id+'</li>');
        })
        return lidata;
    };

    function init(){
        data = [];
        showdata = data;
        initHtml();
    };

    function filter(text){
        var regexp = RegExp(text)
        showdata = data.filter(element => regexp.test(element.id))
        updateClusterList(dataToLi(showdata));
    };

    function checkInput(){
        var searchtxt = $(searchline).val()
        filter(searchtxt);
    }


    function setInput(text){
        $(searchline).val(text);
        checkInput();
    }


    function selectFirst(){
        var element = $(list).children("ul").children("li:first-child");
        element.trigger("click");
    }


    function clear(){
        showdata = [{"id":"loading..."}];
        updateClusterList(dataToLi(showdata));
    }


    init();


    $(document).on(listname+"_loaded",function(event){
        data = model.getNodes(listname);
        if(!showdata){
            initClusterList(dataToLi(data));
        }
        else{
            updateClusterList(dataToLi(data));
        }
        showdata = data;
        checkInput();
    });


    return {
        setInput: setInput,
        selectFirst: selectFirst,
        clear: clear
    };
};
