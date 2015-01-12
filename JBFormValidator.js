/*
Form Validator By John Bricklayer
www.dvestezar.cz
for Joomla Forms Framework

need JB library

v 2014.12.14.1952

*/

if(JB.is.und(Q)){
	if(JB.is.und(jQuery)){
		alert('jQuery neexistuje!');
	}
	var Q=jQuery;
}
var JB_VF_default={
	infoico_src:'http://www.dvestezar.cz/!moje_js/add/ico_war.png',
	msgs:{
		'err_form_valid' : 'Formulář není zprávně vyplněn, zkontroluj správné údaje.',
		'dt'		: 'Zadaný údaj musí být datum. (d.m.rrrr)',
		'dttm'	 	: 'Zadaný údaj musí být daum a čas. (d.m.rrrr HH:MM:SS)',
		'tm'		: 'Zadaný údaj musí být celý čas. (HH:MM:SS)',
		'tml'		: 'Zadaný údaj musí být čas. (HH:MM)',
		'tx'		: 'Minimální počet znaků pro zadaný text je : ',
		'int'		: 'Zadaný údaj musí být celé číslo.',
		'pint'		: 'Zadaný údaj musí být celé číslo větší nebo rovno nule.',
		'ppint'		: 'Zadaný údaj musí být celé číslo větší jak nula.',
		'dbl'		: 'Zadaný údaj musí být číslo.',
		'pdbl'		: 'Zadaný údaj musí být číslo větší nebo rovno nule.',
		'ppdbl'		: 'Zadaný údaj musí být číslo větší jak nula.',
		'mail'		: 'Zadaný údaj musí být jedna e-mailová adresa.',
		'mmail'		: 'Zadaný údaj musí být e-mailová adresa, může obsahovat více e-mailů oddělených středníkem.',
		'imei'		: 'Zadaný údaj musí být IMEI.',
		'psc'		: 'Zadaný údaj musí být PSČ.',
		'ip'		: 'Zadaný údaj musí být jen jedna IP adresa.',
		'ips'		: 'Zadaný údaj musí být IP adresa nebo adresy oddělené středníkem.',
		'tel'		: 'Zadaný údaj musý být jedno telefonní číslo.',
		'tels'		: 'Zadaný údaj musý být telefonní číslo nebo tel.čísla oddělené středníkem.'
	}
}	

JB_FV = function(form,v_o){
	/*
		form = object formu, nebo string pro vyhledání pomocí jQuery
			př.:	$('form[name="frmSave"]') podle jména formu
					$('#frmSave') podle id formu
	*/
	var v_f; // jQuery from object
	
	
	this.vld; // object of validation object
	
	this.validate_el=function(toto){
		var x;
	
	
		var va=this.JB_VF;
		var ico=this.JB_VF_infoicon;
		var vo=true;
		var val=String(Q(this).val()).trim();
		//test if textarea JCE nebo TinyMCE wisiwig
		if(/textarea/.test(this.type)){
			x=Q('#'+this.id+'_ifr');
			if(x.length>0){
				x=x.contents().find("body");
				if(x.length>0){
					val=x.text();
				}
			}
		}
		
		if((va[2]==false)&&(val=='')){
			vo=true;
		}else if((va[2]==true)&&(val=='')){
			vo=false;
		}else{
			if(va[1]=='t'){
				if(va[3]=='dt'){
					vo=JB.is.date(val);
				}else if(va[3]=='dttm'){
					vo=JB.is.datetime(val);
				}else if(va[3]=='tm'){
					vo=JB.is.time(val);
				}else if(va[3]=='tml'){
					vo=/\d{1,2}:d{1,2}/.test(val);
					if(vo){
						x=String(val).split(/:/);
						if((x[0]*1)<24){
							vo=((x[1]*1)<59);
						}else{
							vo=false;
						}
					}
				}else if(/^tx(\d+)?$/.test(va[3])){
					x=String(va[3]).replace(/^tx/,'');
					if(x!=''){
						if(String(val).length<(x*1)){
							vo=false;
						}
					}
				}else if(va[3]=='int'){
					vo=JB.is.integer(val);
				}else if(va[3]=='pint'){
					vo=JB.is.integer(val,{pos:true});
				}else if(va[3]=='ppint'){
					vo=JB.is.integer(val,{pos:true,nz:true});
				}else if(va[3]=='dbl'){
					vo=JB.is.number(val);
				}else if(va[3]=='pdbl'){
					vo=JB.is.number(val);
					if(vo){
						vo=((val*1)>=0);
					}
				}else if(va[3]=='ppdbl'){
					vo=JB.is.number(val);
					if(vo){
						vo=((val*1)>0);
					}
				}else if(va[3]=='mail'){
					vo=JB.is.email(val);
				}else if(va[3]=='mmail'){
					vo=JB.is.email(val,true);
				}else if(va[3]=='imei'){
					vo=JB.is.IMEI(val,true);
				}else if(va[3]=='psc'){
					vo=JB.is.PSC(val);
				}else if(va[3]=='ip'){
					vo=JB.is.IP(val,false);
				}else if(va[3]=='ips'){
					vo=JB.is.IP(val,true);
				}else if(va[3]=='tel'){
					vo=JB.is.telnum(val);
				}else if(va[3]=='tels'){
					vo=JB.is.telnums(val,true,true);
				}
			}else if(va[1]=='f'){
				try{
					eval('vo=toto.vld.'+va[3]);
				}catch(e){
					console.error('ERROR validate input '+toto.id+' : '+e);
				}
			}
		}
		
		toto.set_valid(this,vo);
		return vo;
	}
	
	this.set_valid=function(el_inp,status){
		var css='invalid';
		var f=Q(el_inp.form);
		var x=Q(f).find('label[for="'+el_inp.id+'"]');
		if(status){
			Q(el_inp).removeClass(css);
			x.removeClass(css);
			Q(el_inp.JB_VF_infoicon).hide();
		}else{
			Q(el_inp).addClass(css);
			x.addClass(css);
			Q(el_inp.JB_VF_infoicon).show();
		}
	}
	
	this.validate_form=function(form,msg){
		var elid,el;
		var o=true;
		for(elid=0;elid<form.elements.length;elid++){
			try{
				el=form.elements[elid];
				if(!JB.is.und(el.valid)){
					if(!el.valid())
						o=false;
				}
			}catch(e){
				console.error('ERROR Validate form idx:'+elid+' id:'+el.id+'  :'+e);
			}
			
		}
		if(!o){
			if(msg==true)
				alert(JB_VF_default.msgs.err_form_valid);
		}
		return o;
	}
	
	this.onsubmitcheck=function(e){
		//fn musí být bindnuta na form
		if(!this.valid()){
			e.preventDefault();
			return false;
		}
	}
	
	this.init=function(form,v_o){
		this.vld=v_o;
		if(typeof form=='string'){
			v_f=Q(form);
			if(v_f.length!=1){
				return false;
			}
		}else{
			v_f=Q(form);
		}
		var e,a,x,ii,tp,tl,alid,xid;
		var v=v_o.validate;
		
		v_f[0].valid=this.validate_form.bind(this,v_f[0],true);
		
		v_f.submit(this.onsubmitcheck.bind(v_f[0]));
		
		for(elid=0;elid<v.field.length;elid++){
			el=v.field[elid];
			a='[name="'+v.fields+'['+el[0]+']"]';
			e=v_f.find(a);
			if(e.length>0){
				for(xid=0;xid<e.length;xid++){
					x=e[xid];
					x.JB_VF=el;
					x.onkeyup=this.validate_el.bind(x,this);
					x.onchange=this.validate_el.bind(x,this);
					x.valid=this.validate_el.bind(x,this);
					ii=JB.x.cel('img',{app:false,csN:'JB_VF_infoico'});
					ii.src=JB_VF_default.infoico_src;
					x.parentNode.insertBefore(ii,x.nextSibling); //insert after x
					x.JB_VF_infoicon=ii;
					Q(ii).hide();
					
					if(el[1]=='t'){
						tp=el[3];
						tl='';
						if(/^tx/.test(tp)){
							tp='tx';
							tl=String(el[3]).replace(/^tx/,'');
						}
						x=JB_VF_default.msgs[tp];
						if(!JB.is.und(x)){
							ii.title=x+tl;
						}
					}else if(el[1]=='f'){
						if(el.length>4){
							x=el[4];
							x=v_o.messages[x];
							if(!JB.is.und(x)){
								ii.title=x;
							}
						}
					}
				}
			}
		}
		this.validate_form(v_f[0],false);
		try{
			var myTips = new Tips('.JB_VF_infoico');
		}catch(e){
			console.warn('Tooltip : '+e)
		};
	}
	this.init(form,v_o);
}