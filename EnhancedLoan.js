/* 
 * github: https://github.com/dominicg666,
   Blog:https://dominicdomu.blogspot.com/
   source:https://github.com/dominicg666/KJE-Calculator
 */
KJE.EnhancedLoanCalc=function(){this.MSG_ERROR1=KJE.parameters.get("MSG_ERROR1","Payment must be greater than zero.");this.MSG_ERROR2=KJE.parameters.get("MSG_ERROR2","Balance must be greater than zero.");this.MSG_ERROR3=KJE.parameters.get("MSG_ERROR3","Term must be greater than zero.");this.MSG_ERROR4=KJE.parameters.get("MSG_ERROR4","Rate must at least zero.");this.MSG_ERROR5=KJE.parameters.get("MSG_ERROR5","Calculated loan balance is less than zero.");this.MSG_ERROR6=KJE.parameters.get("MSG_ERROR6","Calculated term is zero.");this.MSG_ERROR7=KJE.parameters.get("MSG_ERROR7","Calculated loan term exceeds 360 months.");this.MSG_ERROR8=KJE.parameters.get("MSG_ERROR8","Calculated loan balance exceeds MSG_AMOUNT_LIMIT.");this.MSG_ERROR9=KJE.parameters.get("MSG_ERROR9","Calculated interest rate is less than zero.");this.MSG_ERROR10=KJE.parameters.get("MSG_ERROR10","Calculated interest rate exceeds MSG_AMOUNT_LIMIT.");this.MSG_ERROR11=KJE.parameters.get("MSG_ERROR11","Calculated loan payment exceeds MSG_AMOUNT_LIMIT.");this.INPUT_YEARS=KJE.parameters.get("INPUT_YEARS",false);this.CALCULATE_THIS=KJE.EnhancedLoanCalc.CALC_AMOUNT;this.BY_YEAR=false;this.NEW_LOAN_BALANCE=0;this.NEW_LOAN_RATE=0;this.NEW_LOAN_PAYMENT=0;this.NEW_LOAN_TERM=0;this.INTEREST_NEW=0;this.NEW_PAYOFF="";this.sSchedule=new KJE.Repeating()};KJE.EnhancedLoanCalc.prototype.clear=function(){};KJE.EnhancedLoanCalc.prototype.calculate=function(o){var h=KJE;if(this.INPUT_YEARS){this.NEW_LOAN_TERM=this.NEW_LOAN_TERM*12}if(this.CALCULATE_THIS==KJE.EnhancedLoanCalc.CALC_AMOUNT){if(this.NEW_LOAN_PAYMENT<=0){throw (this.MSG_ERROR1)}if(this.NEW_LOAN_TERM<=0){throw (this.MSG_ERROR3)}if(this.NEW_LOAN_RATE<0){throw (this.MSG_ERROR4)}this.NEW_LOAN_BALANCE=h.round(KJE.PV(this.NEW_LOAN_RATE/1200,this.NEW_LOAN_TERM,this.NEW_LOAN_PAYMENT)-0.5,0);if(this.NEW_LOAN_BALANCE<=0){throw (this.MSG_ERROR5)}if(this.NEW_LOAN_BALANCE>=10000000){throw (KJE.replace("MSG_AMOUNT_LIMIT",h.dollars(10000000),this.MSG_ERROR8))}}else{if(this.CALCULATE_THIS==KJE.EnhancedLoanCalc.CALC_TERM){if(this.NEW_LOAN_PAYMENT<=0){throw (this.MSG_ERROR1)}if(this.NEW_LOAN_BALANCE<=0){throw (this.MSG_ERROR2)}if(this.NEW_LOAN_RATE<0){throw (this.MSG_ERROR4)}this.NEW_LOAN_TERM=KJE.PERIODS(this.NEW_LOAN_RATE/1200,this.NEW_LOAN_PAYMENT,this.NEW_LOAN_BALANCE);if(this.NEW_LOAN_TERM<=0){throw (this.MSG_ERROR6)}if(this.NEW_LOAN_TERM>=360){throw (this.MSG_ERROR7)}}else{if(this.CALCULATE_THIS==KJE.EnhancedLoanCalc.CALC_RATE){if(this.NEW_LOAN_BALANCE<=0){throw (this.MSG_ERROR2)}if(this.NEW_LOAN_TERM<=0){throw (this.MSG_ERROR3)}if(this.NEW_LOAN_PAYMENT<=0){throw (this.MSG_ERROR1)}if((this.NEW_LOAN_PAYMENT*this.NEW_LOAN_TERM)<this.NEW_LOAN_BALANCE){throw (this.MSG_ERROR9)}this.NEW_LOAN_RATE=KJE.RATE(this.NEW_LOAN_TERM,this.NEW_LOAN_PAYMENT,this.NEW_LOAN_BALANCE)*1200;if(this.NEW_LOAN_RATE>200){throw (KJE.replace("MSG_AMOUNT_LIMIT",h.percent(200),this.MSG_ERROR10))}}else{if(this.NEW_LOAN_BALANCE<=0){throw (this.MSG_ERROR2)}if(this.NEW_LOAN_TERM<=0){throw (this.MSG_ERROR3)}if(this.NEW_LOAN_RATE<0){throw (this.MSG_ERROR4)}this.NEW_LOAN_PAYMENT=h.round(KJE.PMT(this.NEW_LOAN_RATE/1200,this.NEW_LOAN_TERM,this.NEW_LOAN_BALANCE),2);if(this.NEW_LOAN_PAYMENT>20000){throw (KJE.replace("MSG_AMOUNT_LIMIT",h.dollars(20000),this.MSG_ERROR11))}}}}var q=Math.round(this.NEW_LOAN_TERM);var l=0;this.DR_NEW_BALANCE=KJE.FloatArray(q);this.DR_NEW_PRINCIPAL=KJE.FloatArray(q);this.DR_NEW_INTEREST=KJE.FloatArray(q);this.DR_LOAN_PAYMENT=KJE.FloatArray(q);this.DR_GRAPH_BALANCE=KJE.FloatArray(q);this.INTEREST_NEW=0;var d=0;var b=0;var c=this.NEW_LOAN_BALANCE;var a=this.NEW_LOAN_PAYMENT;var f=0;for(f=0;(f<q);f++){d=h.round(this.NEW_LOAN_RATE/1200*c,2);b=this.NEW_LOAN_PAYMENT-d;c-=b;if(c<0){a+=c;c=0;b=a-d}else{a=this.NEW_LOAN_PAYMENT}if(q-1==f){if(c>0.005||c<0.005){a+=c;c=0;b=a-d}else{c=0}}if(this.BY_YEAR){var e=Math.floor(f/12);this.DR_NEW_BALANCE[e]=c;this.DR_NEW_INTEREST[e]+=d;this.DR_NEW_PRINCIPAL[e]+=b;this.DR_LOAN_PAYMENT[e]+=d+b}else{this.DR_NEW_BALANCE[f]=c;this.DR_NEW_INTEREST[f]=d;this.DR_NEW_PRINCIPAL[f]=b;this.DR_LOAN_PAYMENT[f]=d+b}this.INTEREST_NEW+=d;this.DR_GRAPH_BALANCE[f]=c}this.NEW_PAYOFF=KJE.getTermLabel(q,true);if(o){var k=this.sSchedule;k.clearRepeat();k.addHeader((this.BY_YEAR?k.sReportCol("Year",2):k.sReportCol("&nbsp;",1)),k.sReportCol("Payment"+(this.BY_YEAR?"s":"")+"",3),k.sReportCol("Interest",4),k.sReportCol("Principal",5),k.sReportCol("Balance",6));k.addRepeat("&nbsp;","&nbsp;","&nbsp;","&nbsp;",h.dollars(this.NEW_LOAN_BALANCE))}var m=0;q=(q);var g=1;if(q>=120){g=12}var j=Math.floor(q/g)+1;this.cats=KJE.FloatArray(j);this.DS_NEW_BALANCE=KJE.FloatArray(j);this.cats[m]="0";this.DS_NEW_BALANCE[m++]=(this.NEW_LOAN_BALANCE);for(f=1;f<=q;f++){l=f-1;if(f%g==0){this.cats[m]=""+(q<120?m*g:m);this.DS_NEW_BALANCE[m++]=this.DR_GRAPH_BALANCE[l]}if(o){if(!this.BY_YEAR){k.addRepeat(f,h.dollars(this.DR_LOAN_PAYMENT[l],2),h.dollars(this.DR_NEW_INTEREST[l],2),h.dollars(this.DR_NEW_PRINCIPAL[l],2),h.dollars(this.DR_NEW_BALANCE[l],2))}}}if(o){if(this.BY_YEAR){for(l=0;l<=q&&this.DR_LOAN_PAYMENT[l]>0;l++){k.addRepeat((l+1),h.dollars(this.DR_LOAN_PAYMENT[l],2),h.dollars(this.DR_NEW_INTEREST[l],2),h.dollars(this.DR_NEW_PRINCIPAL[l],2),h.dollars(this.DR_NEW_BALANCE[l],2))}}}};KJE.EnhancedLoanCalc.prototype.formatReport=function(b){var c=KJE;var a=this.iDecimal;var d=b;d=KJE.replace("NEW_LOAN_BALANCE",c.dollars(this.NEW_LOAN_BALANCE),d);d=KJE.replace("NEW_LOAN_RATE",c.percent(this.NEW_LOAN_RATE/100,3),d);d=KJE.replace("NEW_LOAN_PAYMENT",c.dollars(this.NEW_LOAN_PAYMENT,2),d);d=KJE.replace("NEW_LOAN_TERM",c.number(this.NEW_LOAN_TERM/12,1),d);d=KJE.replace("NEW_LOAN_MONTHS",c.number(this.NEW_LOAN_TERM),d);d=KJE.replace("NEW_PAYOFF",this.NEW_PAYOFF,d);d=KJE.replace("INTEREST_NEW",c.dollars(this.INTEREST_NEW,2),d);d=KJE.replace("TOTAL_OF_PAYMENTS",c.dollars(this.INTEREST_NEW+this.NEW_LOAN_BALANCE,2),d);d=d.replace("**REPEATING GROUP**",this.sSchedule.getRepeat());this.sSchedule.clearRepeat();return d};KJE.EnhancedLoanCalc.CALC_AMOUNT=0;KJE.EnhancedLoanCalc.CALC_RATE=1;KJE.EnhancedLoanCalc.CALC_TERM=2;KJE.EnhancedLoanCalc.CALC_PAYMENT=3;KJE.EnhancedLoanCalc.CALC_INDEX=[KJE.EnhancedLoanCalc.CALC_PAYMENT,KJE.EnhancedLoanCalc.CALC_RATE,KJE.EnhancedLoanCalc.CALC_TERM,KJE.EnhancedLoanCalc.CALC_AMOUNT];KJE.EnhancedLoanCalc.CALC_DESC=KJE.parameters.get("ARRAY_CALC_DESC",["Monthly Payment","Interest rate","Term","Loan amount"]);KJE.CalcName="Enhanced Loan Calculator";KJE.CalcType="EnhancedLoan";KJE.CalculatorTitleTemplate="Your KJE1 loan has a payment of KJE2";KJE.parseInputs=function(b){var a=KJE.getDropBox("CALC_INDEX",KJE.parameters.get("CALC_INDEX",KJE.EnhancedLoanCalc.CALC_PAYMENT),KJE.EnhancedLoanCalc.CALC_INDEX,KJE.EnhancedLoanCalc.CALC_DESC);b=KJE.replace("**CALC_INDEX**",a,b);return b};KJE.initialize=function(){KJE.CalcControl=new KJE.EnhancedLoanCalc();KJE.GuiControl=new KJE.EnhancedLoan(KJE.CalcControl)};KJE.EnhancedLoan=function(h){var g=KJE;var e=KJE.gLegend;var b=KJE.inputs.items;this.tfInput=new Array(4);this.MSG_GRAPH_TITLE1=KJE.parameters.get("MSG_GRAPH_TITLE1","Loan Balance by Year");this.MSG_GRAPH_TITLE2=KJE.parameters.get("MSG_GRAPH_TITLE2","Loan Balance by Month");this.MSG_GRAPH_LBL1=KJE.parameters.get("MSG_GRAPH_LBL1","New balance");this.tfInput[KJE.EnhancedLoanCalc.CALC_AMOUNT]=KJE.DollarSlider("NEW_LOAN_BALANCE","Loan amount",0,10000000,0,1,2);this.tfInput[KJE.EnhancedLoanCalc.CALC_RATE]=KJE.PercentSlider("NEW_LOAN_RATE","Interest rate",0,24,3);if(h.INPUT_YEARS){this.tfInput[KJE.EnhancedLoanCalc.CALC_TERM]=KJE.NumberSlider("NEW_LOAN_TERM","Term in years",1,30,0)}else{this.tfInput[KJE.EnhancedLoanCalc.CALC_TERM]=KJE.NumberSlider("NEW_LOAN_TERM","Term in months",1,360,0,6)}this.tfInput[KJE.EnhancedLoanCalc.CALC_PAYMENT]=KJE.DollarSlider("NEW_LOAN_PAYMENT","Monthly payment",0,100000,2,1,7);KJE.DropBox("CALC_INDEX","Calculate for",null,null,"bold");KJE.Radioboxes("YEAR","Report amortization",true,"Annually","Monthly");var a=KJE.gNewGraph(KJE.gLINE,"GRAPH1",true,false,KJE.colorList[1],this.MSG_GRAPH_TITLE2);a._legend.setVisible(false);a._iArea=KJE.gGraphLine.AREA_FIRST_ONLY;a._legend._iOrientation=(e.TOP_RIGHT);var f=KJE.parameters.get("MSG_DROPPER_TITLE","Enhanced Loan Inputs:");var d=KJE.parameters.get("MSG_DROPPER_CLOSETITLE","Loan amount KJE1, Payment KJE4, Term of KJE3 at KJE2");var c=function(){return f+KJE.subText(KJE.getKJEReplaced(d,b.NEW_LOAN_BALANCE.getFormatted(),b.NEW_LOAN_RATE.getFormatted(),h.NEW_PAYOFF,b.NEW_LOAN_PAYMENT.getFormatted()),"KJECenter")};KJE.addDropper(new KJE.Dropper("INPUTS",true,f,c),KJE.colorList[0])};KJE.EnhancedLoan.prototype.setValues=function(c){var a=KJE.inputs.items;c.NEW_LOAN_BALANCE=a.NEW_LOAN_BALANCE.getValue();c.NEW_LOAN_RATE=a.NEW_LOAN_RATE.getValue();c.NEW_LOAN_PAYMENT=a.NEW_LOAN_PAYMENT.getValue();c.NEW_LOAN_TERM=a.NEW_LOAN_TERM.getValue();c.CALCULATE_THIS=a.CALC_INDEX.getValue();c.BY_YEAR=a.YEAR.getValue();var b=KJE.EnhancedLoanCalc.CALC_INDEX.length;for(var d=0;d<b;d++){if(c.CALCULATE_THIS==d){this.tfInput[d].disable()}else{this.tfInput[d].enable()}}};KJE.EnhancedLoan.prototype.refresh=function(e){var d=KJE;var c=KJE.gLegend;var b=KJE.inputs.items;var a=KJE.gGraphs[0];KJE.setTitleTemplate(d.dollars(e.NEW_LOAN_BALANCE),d.dollars(e.NEW_LOAN_PAYMENT,2));a.removeAll();a.setGraphCategories(e.cats);if(e.NEW_LOAN_TERM>120){a.setTitle(this.MSG_GRAPH_TITLE1)}else{a.setTitle(this.MSG_GRAPH_TITLE2)}a.add(new KJE.gGraphDataSeries(e.DS_NEW_BALANCE,this.MSG_GRAPH_LBL1,a.getColor(1)));a.paint();this.tfInput[KJE.EnhancedLoanCalc.CALC_AMOUNT].setText(d.dollars(e.NEW_LOAN_BALANCE),true);this.tfInput[KJE.EnhancedLoanCalc.CALC_RATE].setText(d.percent(e.NEW_LOAN_RATE/100,3),true);this.tfInput[KJE.EnhancedLoanCalc.CALC_PAYMENT].setText(d.dollars(e.NEW_LOAN_PAYMENT,2),true);this.tfInput[KJE.EnhancedLoanCalc.CALC_TERM].setText(d.number(e.INPUT_YEARS?e.NEW_LOAN_TERM/12:e.NEW_LOAN_TERM),true)};KJE.InputScreenText=" <div id=KJE-D-INPUTS><div id=KJE-P-INPUTS>Input information:</div></div> <div id=KJE-E-INPUTS > <div id=\"KJE-C-CALC_INDEX\">**CALC_INDEX**</div> <div id='KJE-C-NEW_LOAN_BALANCE'><input id='KJE-NEW_LOAN_BALANCE' /></div> <div id='KJE-C-NEW_LOAN_RATE'><input id='KJE-NEW_LOAN_RATE' /></div> <div id='KJE-C-NEW_LOAN_PAYMENT'><input id='KJE-NEW_LOAN_PAYMENT' /></div> <div id='KJE-C-NEW_LOAN_TERM'><input id='KJE-NEW_LOAN_TERM' /></div> <div id=\"KJE-C-YEAR\"><input id=\"KJE-YEAR1\" type=radio name=YEAR /><input id=\"KJE-YEAR2\" type=radio name=YEAR /></div> <div style=\"height:10px\"></div> </div> **GRAPH1** ";KJE.DefinitionText=" <div id='KJE-D-NEW_LOAN_PAYMENT' ><dt>Monthly payment</dt><dd>Monthly payment for this loan.</dd></div> <div id='KJE-D-NEW_LOAN_RATE' ><dt>Interest rate</dt><dd>Annual interest rate for this loan. Interest is calculated monthly on the current outstanding balance of your loan at 1/12 of the annual rate.</dd></div> <div id='KJE-D-NEW_LOAN_TERM' ><dt>Term in months</dt><dd>Number of months for this loan.</dd></div> <div id='KJE-D-NEW_LOAN_BALANCE' ><dt>Loan amount</dt><dd>Total amount of your loan.</dd></div> ";