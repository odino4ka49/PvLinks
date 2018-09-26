PVLINKS.namespace("PVLINKS.myList");
class myStack {
    constructor(startdata)
    {
        if(startdata){
            this.items = startdata;
            this.disabled = false;
        }
        else{
            this.disabled = true;
        }
    }
    push(element)
    {
        if(!this.disabled){
            this.items.push(element);
            if(this.items.length>5){
                this.items.shift();
            }
        }
    }
    getData(){
        return this.items;
    }
};

PVLINKS.myList = function(model,div,listname,additionalFunction){
    var model = model,
        div = div,
        searchline,
        list,
        data,
        showdata,
        clusterize,
        listname = listname,
        additionalFunction = additionalFunction,
        lastreq,
        lastreqlist;


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
        searchline.setAttribute("list", listname+"lastreqlist");
        lastreqlist = document.createElement("datalist");
        lastreqlist.setAttribute("id", listname+"lastreqlist");
        div.append(searchline,lastreqlist,list);
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
                if(lastreq){
                    lastreq.push($(target).text());
                    updateLastReq();
                }
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
    };


    function setInput(text){
        $(searchline).val(text);
        checkInput();
    };


    function selectFirst(){
        var element = $(list).children("ul").children("li:first-child");
        element.trigger("click");
    };


    function updateLastReq(){
        if(lastreq){
            $(lastreqlist).empty();
            lastreq.getData().forEach(function(elem){
                var option = document.createElement("option");
                option.setAttribute("value",elem);
                $(lastreqlist).prepend(option);
            });
        }
    };


    function clear(message){
        showdata = []
        if(message){
            showdata.push({"id":message});
        }
        updateClusterList(dataToLi(showdata));
    };


    function getNode(id){
        return data[data.map(function(x) {return x.id}).indexOf(id)];
    };


    init();


    $(document).on(listname+"_loaded",function(event){
        data = model.getNodes(listname);
        lastr = model.getLastReq(listname);
        if(lastr){
            lastreq = new myStack(lastr);
        }
        updateLastReq();
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
        clear: clear,
        getNode: getNode
    };
};
