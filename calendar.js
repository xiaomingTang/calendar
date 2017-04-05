window.onload=function(){
 	
	function $(id){
		return document.getElementById(id);
	}
 	
	
	//传入一个Data类型的数据
	function Calendar(date){
		
		this.dateObj=date;
		
		this.time=this.dateObj.getTime();
		this.year=this.dateObj.getFullYear();		//月份  0起
		this.month=this.dateObj.getMonth();
		this.date=this.dateObj.getDate();			//日期  1起
		this.day=this.dateObj.getDay();				//星期  0:星期天
		this.hour=this.dateObj.getHours();
		this.minute=this.dateObj.getMinutes();
		this.second=this.dateObj.getSeconds();
		this.millisecond=this.dateObj.getMilliseconds();
		
		this.pre=new Date(this.year,this.month,1).getDay();
		this.num=new Date((new Date(this.year,this.month+1,1)).getTime()-24*60*60*1000).getDate();
		this.suf=(42-this.pre-this.num)%7;
		
		this.isOver=((42-this.pre-this.num)<=7);		//日历行数是否超过5行
		
		this.box=null;
		this.elem=null;
		this.isSelected=false;		//年份、月份是否可选
		this.isSuitable=false;		//日历行数是否自适应
		
		this.selectType=0;			//日期选择模式 0:不可选 1:选择一个日期 2:选择一个时间段
		
		this.selectStart=null;
	}
	
	Calendar.prototype={
		constructor:Calendar,
		
		//所有日期属性同步到date,而无须新建对象(意即更换当前this对象的date)
		synchData:function(date){
			this.dateObj=date;
			this.time=this.dateObj.getTime();
			this.year=this.dateObj.getFullYear();		//月份  0起
			this.month=this.dateObj.getMonth();
			this.date=this.dateObj.getDate();			//日期  1起
			this.day=this.dateObj.getDay();				//星期  0:星期天
			this.hour=this.dateObj.getHours();
			this.minute=this.dateObj.getMinutes();
			this.second=this.dateObj.getSeconds();
			this.millisecond=this.dateObj.getMilliseconds();
			
			this.pre=new Date(this.year,this.month,1).getDay();
			this.num=new Date((new Date(this.year,this.month+1,1)).getTime()-24*60*60*1000).getDate();
			this.suf=(42-this.pre-this.num)%7;
			
			this.isOver=((42-this.pre-this.num)<=7);
			return this;
		},
			
		//在elem中创建一个table,true则固定6行,false则随日期变化自适应行数
		//当日的日期className="today"
		buildTableIn:function(elem,isSuitable,selectType){
			if(typeof elem == "object"){
				this.elem=elem;
				this.isSuitable=isSuitable;
				this.selectType=selectType;
			}
			else{
				elem=this.elem;
				isSuitable=this.isSuitable;
				selectType=this.selectType;
			}
			var table=document.createElement("table");
			
			var num=isSuitable ? this.pre+this.num+this.suf : 42,
				curDate=new Date(),
				curYear=curDate.getFullYear(),
				curMonth=curDate.getMonth(),
				tempDate= curYear<this.year ? -8 : curYear>this.year ? 40 : curMonth<this.month ? -8 : curMonth>this.month ? 40 : curDate.getDate() ;
			for(var i=0;i<num;i++){
				if(i%7==0){
					var tr=document.createElement("tr");
					table.appendChild(tr);
				}
				var td=document.createElement("td");
				tr.appendChild(td);
				if(i+1-this.pre>0 && i+1-this.pre<=this.num){
					td.appendChild(document.createTextNode(i+1-this.pre));
					var date=i+1-this.pre;	//td的自定义属性index,表示今天的号数（几月几号中的几号,number类型）
					td.index=date;
					
					if(date<tempDate){
						td.className="pre";
					}
					else if(date==tempDate){
						td.className="today";
					}
					else if(date>tempDate){
						td.className="future";
					}
					
					if(i%7==0 || i%7==6){
						td.className+=" weekend";
					}
					
					
					
					switch(selectType){
						case 0:
							break;
						case 1:
							if(date>=tempDate){
								var that=this;
								td.onclick=function(event){
									alert(that.year+"年"+(that.month+1)+"月"+event.target.index+"日");
								}
							}
							break;
						case 2:
							if(date>=tempDate){
								var that=this;
								td.onclick=function(event){
									if(!that.selectStart){
										that.selectStart=new Date(that.year,that.month,event.target.index);
										that.addClass(event.target,"select-start");
									}
									else{
										selectEnd=new Date(that.year,that.month,event.target.index);
										if(selectEnd>that.selectStart){
											alert("您选择的日期是："+that.selectStart.getFullYear()+"-"+(that.selectStart.getMonth()+1)+"-"+that.selectStart.getDate()+"到"+selectEnd.getFullYear()+"-"+(selectEnd.getMonth()+1)+"-"+selectEnd.getDate());
											that.selectStart=null;
											that.delClass(document.getElementsByClassName("select-start")[0],"select-start");
										}
										else if(selectEnd-that.selectStart==0){
											that.selectStart=null;
											that.delClass(document.getElementsByClassName("select-start")[0],"select-start");
										}
										else{
											alert("日期选择有误,只能选择"+that.selectStart.getFullYear()+"-"+that.selectStart.getMonth()+"-"+that.selectStart.getDate()+"之后的日期");
										}
									}
								}
							}
							break;
						default:
							break;
					}
					
					
					
					
					
				}
			}
			elem.appendChild(table);
			return this;
		},
		//在elem上重建,首先清除elem的innerHTML
		reBuildTableIn:function(elem,isSuitable,selectType){
			if(typeof elem == "object"){
				this.elem=elem;
				this.isSuitable=isSuitable;
				this.selectType=selectType;
			}
			else{
				elem=this.elem;
				isSuitable=this.isSuitable;
				selectType=this.selectType;
			}
			elem.innerHTML="";
			this.buildTableIn(elem,isSuitable,selectType);
			return this;
		},
		
		buildBoxIn:function(box,isSelected,isSuitable,selectType){
			if(typeof box == "object"){
				this.box=box;
				this.isSelected=isSelected;
				this.isSuitable=isSuitable;
				this.selectType=selectType;
			}
			else{
				box=this.box;
				isSelected=this.isSelected;
				isSuitable=this.isSuitable;
				selectType=this.selectType;
			}
			//日历头部,包含年月,及是否可选
			var div=document.createElement("div"),
				frag=document.createDocumentFragment();
			frag.appendChild(div);
			div.className="calendar_head";
			//年月
			if(!isSelected){
				div.appendChild(document.createTextNode(this.year+"年"+(this.month+1)+"月"));
			}
			else{
				//pre-month
				var left=document.createElement("div");
				div.appendChild(left);
				left.className="pre-month";
				var that=this;
				left.onclick=function(){
					that.synchData(new Date(that.year,that.month-1,that.date)).reBuildBoxIn();
				}
				//可选
				//年选择条
				var selectbox=document.createElement("select");
				div.appendChild(selectbox);
				for(var i=2025;i>1998;i--){
					var optionbox=document.createElement("option");
					selectbox.appendChild(optionbox);
					optionbox.appendChild(document.createTextNode(i));
					if(i==this.year){
						optionbox.selected="selected";
					}
				}
				var that=this;
				selectbox.onchange=function(event){
					var e=event || window.event,
						year=parseInt(e.target.options[e.target.selectedIndex].text);
					that.synchData(new Date(year,that.month,that.date)).reBuildBoxIn();
				}
				div.appendChild(document.createTextNode("年"));
				//月选择条
				var selectbox=document.createElement("select");
				div.appendChild(selectbox);
				for(var i=12;i>0;i--){
					var optionbox=document.createElement("option");
					selectbox.appendChild(optionbox);
					optionbox.appendChild(document.createTextNode(i));
					if(i==this.month+1){
						optionbox.selected="selected";
					}
				}
				selectbox.onchange=function(event){
					var e=event || window.event,
						month=parseInt(e.target.options[e.target.selectedIndex].text)-1;
					that.synchData(new Date(that.year,month,that.date)).reBuildBoxIn();
				}
				div.appendChild(document.createTextNode("月"));
				//next-month
				var right=document.createElement("div");
				div.appendChild(right);
				right.className="next-month";
				var that=this;
				right.onclick=function(){
					that.synchData(new Date(that.year,that.month+1,that.date)).reBuildBoxIn();
				}
			}
			//日历中部，展示星期数
			var table=document.createElement("table"),
				tr=document.createElement("tr");
			frag.appendChild(table);
			table.appendChild(tr);
			var arr=["日","一","二","三","四","五","六"];
			for(var i=0,len=arr.length;i<len;i++){
				var td=document.createElement("td");
				tr.appendChild(td);
				td.appendChild(document.createTextNode(arr[i]));
				td.className="week";
				if(i==0 || i==6){
					td.className+=" weekend";
				}
				
			}
			//日历主体
			var div=document.createElement("div");
			frag.appendChild(div);
			console.log(isSuitable);
			this.buildTableIn(div,isSuitable,selectType);
			box.appendChild(frag);
			return this;
		},
		
		reBuildBoxIn:function(box,isSelected,isSuitable,selectType){
			if(typeof box == "object"){
				this.box=box;
				this.isSelected=isSelected;
				this.isSuitable=isSuitable;
				this.selectType=selectType;
			}
			else{
				box=this.box;
				isSelected=this.isSelected;
				isSuitable=this.isSuitable;
				selectType=this.selectType;
			}
			box.innerHTML="";
			this.buildBoxIn(box,isSelected,isSuitable,selectType);
			return this;
		},
		//为节点elem添加某个类名
		addClass:function(elem,className){
			if(!className){
				console.warn("addClass()失败,类名不得为空.");
				return false;
			}
			var	arr=elem.className.split(" ");
			for(var i in arr){
				if(arr[i]==className){
//					console.warn("addClass()失败,该类名已存在.");
					return false;
				}
			}
			arr.push(className);
			elem.className=arr.join(" ");
			return true;
		},
		//为节点elem删除某个类名
		delClass:function(elem,className){
			if(!className){
				console.warn("delClass()失败,类名不得为空.");
				return false;
			}
			var arr=elem.className.split(" ");
			for(var i in arr){
				if(arr[i]==className){
					arr.splice(i,1);
					elem.className=arr.join(" ");
					return true;
				}
			}
//			console.warn("delClass()失败,不存在该类名");
			return false;
		},
			
	}
	
	var calendar=new Calendar(new Date());
	
	//在$("calendar")上新建一个日历,isSelected,isSuitable;初始化时不可缺省,之后可缺省,默认为上次使用的值.
	//参数缺省则全部缺省,保留则全部保留,不可填写部分参数
	//selectType日期选择模式 0:不可选 1:选择一个日期 2:选择一个时间段
	calendar.buildBoxIn($("calendar"),true,true,2);
	
	
	$("calendar-type").onchange=function(event){
		var oForm=this;
			isSelected=parseInt(oForm.elements["is-selected"].value)==0 ? false : true ,
			isSuitable=parseInt(oForm.elements["is-suitable"].value)==0 ? false : true ,
			selectType=parseInt(oForm.elements["select-type"].value);
		calendar.reBuildBoxIn($("calendar"),isSelected,isSuitable,selectType);
	}
	
}
