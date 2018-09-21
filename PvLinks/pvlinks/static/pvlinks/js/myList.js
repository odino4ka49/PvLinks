PVLINKS.namespace("PVLINKS.myList");
PVLINKS.myList = function(model,div){
    var model = model,
        div = div,
        searchline,
        list,
        d3list,
        d3li,
        data,
        showdata,
        clusterize;


    function initClusterList(lidata){
        clusterize = new Clusterize({
            rows: lidata,
            scrollId: 'scrollArea',
            contentId: 'contentArea'
        })
    };

    function updateClusterList(lidata){
        clusterize.update(lidata);
    };

    function initHtml(){
        searchline = document.createElement("input"),
        list = document.createElement("div");
        list.className = "clusterize-scroll";
        list.setAttribute("id", "scrollArea");
        list.innerHTML = '<ul id="contentArea" class="clusterize-content"><li class="clusterize-no-data">Loading data…</li></ul>';
        div.append(searchline,list);
        if(showdata){
            var lidata = dataToLi(showdata);
            initClusterList(lidata);
        }
        $(searchline).on("input",checkInput);
        list.onclick = function(e){
            e = e || event;
            var target = e.target || e.srcElement;
            console.log(target);
            if(!$(target).hasClass("selected")){
                $(list).children("ul").children("li").removeClass("selected");
                $(target).addClass("selected");
                var pv_id = $(target).text();
                model.loadPvByPv(pv_id);
            }
            else {
                $(target).removeClass("selected");
                $(document).trigger("clearlist","pvlist2");
            }
        }
    };

    function dataToLi(startdata){
        lidata = [];
        startdata.forEach(function(item){
            lidata.push('<li>'+item.id+'</li>');
        })
        return lidata;
    };

    function init(){
        data = model.getPvNodes();
        showdata = data;
        initHtml();
    };

    function filter(text){
        var regexp = RegExp(text)
        console.log(regexp)
        showdata = data.filter(pv => regexp.test(pv.id))
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


    init();


    $(document).on("pv_loaded",function(event){
        data = model.getPvNodes();
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
        setInput: setInput
    };
};
