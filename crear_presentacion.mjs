/** Rebuild slides with: node crear_presentacion.mjs
 * Requires @oai/artifact-tool and LibreOffice. The Codex runtime is the fallback.
 * Override CODEX_NODE_MODULES, CODEX_SKILL_PRESENTATIONS, CODEX_PYTHON or LIBREOFFICE_PATH.
 * Outputs: slides/Presentacion_RTI_EM.pptx and .pdf, private checks in slides/.build.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const runtime=path.join(os.homedir(),'.cache','codex-runtimes','codex-primary-runtime','dependencies');
const modules=process.env.CODEX_NODE_MODULES||path.join(runtime,'node','node_modules');
process.env.RUNTIME_NODE_MODULES=modules;
const skill=process.env.CODEX_SKILL_PRESENTATIONS||path.join(os.homedir(),'.codex','plugins','cache','openai-primary-runtime','presentations','26.1022.11436','skills','presentations');
const python=process.env.CODEX_PYTHON||path.join(runtime,'python','python.exe');
const {Presentation,PresentationFile}=await import(pathToFileURL(path.join(modules,'@oai','artifact-tool','dist','artifact_tool.mjs')).href);
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools','artifact_tool_utils.mjs')).href);
const out=path.join(ROOT,'slides');
const build=path.join(out,'.build',new Date().toISOString().replace(/[:.]/g,'-'));
await fs.mkdir(build,{recursive:true});
const notes=(await fs.readFile(path.join(ROOT,'notes','guion_presentacion_10_min.md'),'utf8')).split(/^## Diapositiva /m).slice(1);
if(notes.length!==12)throw new Error('The Spanish script must have exactly 12 slide sections.');
const C={navy:'#17324D',teal:'#176B87',orange:'#B95925',grey:'#526273',pale:'#EAF1F5',line:'#D7E0E7',white:'#FFFFFF'};
const pres=Presentation.create({slideSize:{width:1280,height:720}});
const refs=[
 'Dempster, Laird & Rubin (1977). Maximum Likelihood from Incomplete Data via the EM Algorithm. DOI: 10.1111/j.2517-6161.1977.tb01600.x',
 'Wu (1983). On the Convergence Properties of the EM Algorithm. DOI: 10.1214/aos/1176346060',
 'Wilson & Patwari (2010). Radio Tomographic Imaging with Wireless Networks. DOI: 10.1109/TMC.2009.174',
 'Bahl & Padmanabhan (2000). RADAR: An In-Building RF-Based User Location and Tracking System. DOI: 10.1109/INFCOM.2000.832252'];
function txt(s,text,x,y,w,h,size=27,bold=false,color=C.navy){
 const sh=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 sh.text=text;sh.text.style={typeface:'Arial',fontSize:size,bold,color,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:0};return sh;
}
function slide(title,source=''){
 const s=pres.slides.add();s.background.fill=C.white;txt(s,title,66,45,1148,88,41,true);
 const n=pres.slides.items.length;txt(s,'Camilo Vásquez  /  Analysis of Algorithms',66,680,1080,20,14,false,C.grey);txt(s,String(n).padStart(2,'0'),1170,680,42,20,14,true,C.teal);
 s.speakerNotes.text=`Diapositiva ${notes[n-1]}\n\nFUENTES Y TRAZABILIDAD\n${source}\n\nREFERENCIAS\n${refs.join('\n')}`;return s;
}
function table(s,values,x,y,w,h,widths,size=25){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.styleOptions={headerRow:true,bandedRows:false};t.borders.assign({style:'solid',fill:C.line,width:1});
 t.cells.block({row:0,column:0,rowCount:values.length,columnCount:values[0].length}).assign({textStyle:{typeface:'Arial',fontSize:size,color:C.navy},margins:{left:12,right:12,top:10,bottom:10},anchor:'center'});
 for(let r=0;r<values.length;r++)for(let c=0;c<values[0].length;c++){let z=t.getCell(r,c);z.fill=r===0?C.navy:r%2===0?C.pale:C.white;z.text.style={typeface:'Arial',fontSize:size,bold:r===0,color:r===0?C.white:C.navy};}return t;
}
function note(s,text,y=609){txt(s,text,66,y,1140,54,21,false,C.orange);}
let s=slide('Expectation-Maximization for RSS noise calibration','Course prototype. EM implementation: em.cpp, C++17 with g++. Numerical data: results/python_preliminary, generated through the C++ EM backend. Python supplies synthetic inputs, RTI and plotting support.');
txt(s,'A synthetic radio tomographic imaging study',66,175,1100,100,43,false,C.teal);
txt(s,'Camilo Vásquez\nYachay Tech University\nSchool of Mathematical and Computational Sciences',66,325,1100,130,27);
txt(s,'C++17 implementation and preliminary results',66,525,1100,45,28,true);note(s,'Synthetic observations. No physical Wi-Fi measurements.');

s=slide('RTI and the role of EM','RTI forward model and ellipsoidal weights: Wilson & Patwari [3]. Fingerprint context: Bahl & Padmanabhan [4]. This study uses generated data rather than their measurements.');
txt(s,'RTI reconstructs attenuation from changes across radio links.',66,156,1120,70,33,true,C.teal);txt(s,'y = W x + noise',66,258,1130,60,43,true);
txt(s,'y: RSS changes on 66 links\nW: link-to-pixel sensitivity matrix\nx: attenuation in 100 image pixels',66,346,590,180,29);
txt(s,'EM estimates the noise distribution\nfrom centered calibration residuals.\n\nIt does not directly output a location.',720,346,480,190,28);note(s,'The target carries no transmitter in the device-free RTI concept.');

s=slide('Questions and experimental design','Protocol: results/python_preliminary/parametros.json. No external mini-tests enter this presentation.');
txt(s,'RQ1  Does parameter error fall as sample size grows?\nRQ2  Do different initial values yield similar estimates?\nRQ3  How useful is the resulting RTI reconstruction?',66,151,1140,164,30);
table(s,[['Setting','Value'],['Area and grid','6.4 m square, 10 x 10 pixels'],['Network','12 perimeter nodes, 66 available links'],['Main calibration and queries','5,000 residuals, 500 paired location cases'],['Reproducibility','Seed 7, independent training/query noise']],66,330,1130,239,[430,700],23);note(s,'Each query has the same observation vector for all compared methods.');

s=slide('Noise model and hidden component','Published zero-mean generator parameters: Wilson & Patwari [3]. General EM: Dempster et al. [1].');
txt(s,'f(r) = p N(r; 0, s1^2) + (1 - p) N(r; 0, s2^2)',66,159,1140,80,35,true,C.teal);
table(s,[['Unknown','Meaning','Generating value'],['p','Probability of the narrow component','0.548'],['s1','Narrow-component standard deviation','0.971 dB'],['s2','Wide-component standard deviation','3.003 dB']],66,268,1130,253,[145,710,275],24);
txt(s,'Observed: residual r in dB\nHidden: which Gaussian generated that residual',66,551,1140,78,27);

s=slide('EM updates','Direct specialization of Dempster et al. [1] to fixed zero means. C++ code: em.cpp. Stopping and initialization cautions: Wu [2].');
txt(s,'E-step: soft component assignment',66,150,1130,46,30,true,C.teal);
txt(s,'tau_i = p phi(r_i; s1) / [p phi(r_i; s1) + (1-p) phi(r_i; s2)]',66,215,1130,70,29);
txt(s,'M-step: weighted estimates',66,313,1130,44,30,true,C.teal);
txt(s,'p_new = sum(tau_i) / N\ns1_new^2 = sum(tau_i r_i^2) / sum(tau_i)\ns2_new^2 = sum((1-tau_i) r_i^2) / sum(1-tau_i)',66,375,1130,149,29);
note(s,'phi(r; s) is the N(0, s^2) density. Stop at relative change < 1e-7 or 500 iterations.',585);

s=slide('One EM iteration by hand','Pedagogical example, not a localization result. Residuals [-3,-1,1,3] dB. Initial p=0.5,s1=1,s2=3. No floor activates. Same example as the report.');
txt(s,'Residuals [-3, -1, 1, 3] dB     Initial p = 0.5, s1 = 1, s2 = 3',66,147,1140,70,28,true,C.teal);
table(s,[['Residuals','tau: narrow','1 - tau: wide'],['-1 and +1 dB','0.657949','0.342051'],['-3 and +3 dB','0.052085','0.947915']],66,241,1130,192,[380,375,375],28);
txt(s,'New p = (2 x 0.657949 + 2 x 0.052085) / 4 = 0.355017\nNew s1 = 1.259700 dB     New s2 = 2.622727 dB',66,479,1130,100,29,true);
note(s,'The larger residuals contribute more weight to the wide component.');

s=slide('Implementation and complexity','Code: em.cpp, C++17 compiled with g++ -std=c++17 -O2. Run build/em.exe --demo for the hand-computed example. N: number of residuals, I: number of iterations, two fixed components. Counts exclude RTI, plotting and I/O. Python adapter em_cpp.py calls the executable for all experimental EM fits. Convergence caution: Wu [2].');
txt(s,'em.cpp (C++17)',66,153,1130,44,31,true,C.teal);
txt(s,'1  Receive residuals and initial p, s1, s2\n2  Evaluate normal log densities\n3  Normalize posterior responsibilities\n4  Update p and weighted second moments\n5  Apply sigma floor and order components\n6  Stop on small parameter change or iteration cap',66,215,1110,280,28);
txt(s,'Time: O(I N) for two components\nWorking memory: O(N)',66,527,1130,80,31,true,C.teal);note(s,'N residuals, I iterations. Floor: 0.15 dB. A stopping flag does not prove global optimality.',625);

s=slide('EM parameter recovery and initialization','Sources: em_sample_size.csv and em_initialization.csv in results/python_preliminary. 20 independent samples per N. Starts experiment: one separate fixed sample of 5,000.');
table(s,[['N','Converged','MAE p','MAE s1 (dB)','MAE s2 (dB)'],['100','19/20','0.1048','0.1671','0.4036'],['500','20/20','0.0375','0.0509','0.1230'],['1,000','20/20','0.0381','0.0501','0.1140'],['5,000','20/20','0.0158','0.0194','0.0479'],['10,000','20/20','0.0109','0.0149','0.0325']],66,157,1130,318,[160,190,230,275,275],24);
txt(s,'20 random starts on one N = 5,000 sample:\n20/20 met tolerance in 85-150 iterations, with nearly identical estimates.',66,514,1130,94,28,true,C.teal);note(s,'Recovery improves broadly with sample size under the model used to generate the data.',621);

s=slide('Fisher scaling changes regularization','Fisher integral and classical RTI are distinct in Wilson & Patwari [3]. This scalar reconstruction is a project extension. Identity holds for gamma>0. Gamma from parametros.json.');
txt(s,'Classical RTI\nx_hat = (W^T W + alpha L)^(-1) W^T y',66,156,1140,113,31);
txt(s,'Exploratory extension\nx_hat_F = (gamma W^T W + alpha L)^(-1) gamma W^T y',66,311,1140,113,30);
txt(s,'Same RTI form with alpha_effective = alpha / gamma\n0.10 / 0.41823 = 0.23910',66,465,1140,96,32,true,C.teal);note(s,'This comparison alone cannot establish an EM benefit over RTI with tuned regularization.',603);

s=slide('Localization compared with a center control','Same 500 queries: metricas.csv and predicciones.csv in results/python_preliminary. Center predicts (3.2,3.2) m without using RSS. Unrounded center mean 2.406646 m / RMSE 2.562239 m.');
table(s,[['Method','Mean error (m)','RMSE (m)'],['Always predict room center','2.407','2.562'],['Classical Tikhonov RTI','3.244','3.840'],['RTI with Fisher scaling','3.062','3.698'],['K-NN fingerprints','2.618','2.891']],66,166,1130,311,[660,235,235],27);
txt(s,'Every tested signal-based method has higher mean error\nthan the center control on these 500 queries.',66,518,1130,90,31,true,C.orange);note(s,'This configuration does not demonstrate useful localization beyond the simple control.',627);

s=slide('Limits and the next experiment','These are proposed next steps, not measured results. No physical through-wall sensing, CSI acquisition or missing-data imputation is implemented.');
txt(s,'Current limits',66,153,1130,45,31,true,C.teal);txt(s,'Calibration and test noise share the same model.\nOne geometry, one main seed and one point target.\nNo real Wi-Fi measurements or obstacle propagation.',66,218,1120,153,30);
txt(s,'Next experiment',66,417,1130,45,31,true,C.teal);txt(s,'Tune alpha using development data, freeze the choice,\nthen test on new seeds with the center control included.',66,482,1130,99,31);note(s,'A wider application claim requires evidence beyond this synthetic study.');

s=slide('Conclusions','Conclusions restricted to the generated calibration diagnostics and 500-case localization study. Full source metadata in these speaker notes and the report.');
txt(s,'EM recovers known mixture parameters more accurately\nas calibration sample size grows, on average.',66,157,1130,95,31,true,C.teal);
txt(s,'The 20 tested starts agree on one fixed sample.\nThis result supports local repeatability.',66,289,1130,90,30);
txt(s,'The localization methods fail to beat the center control\nin mean error. Fisher scaling also changes alpha.',66,415,1130,90,30);
txt(s,'Next step: tune and test the reconstruction before\nexpanding the physical application.',66,545,1130,90,30,true,C.teal);

const candidate=path.join(build,'candidate.pptx');
await(await PresentationFile.exportPptx(pres)).save(candidate);
await fs.mkdir(path.join(build,'final'),{recursive:true});
const validated=path.join(build,'final','validated.pptx');
await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath:validated,pythonExecutable:python,
 integrityValidatorPath:path.join(skill,'container_tools','inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(skill,'container_tools','inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit',...[3,4,6,8,10].flatMap(n=>['--require-native-table-slide',String(n)])],explicitTotalSlideCount:12,
 requiredNativeTableOwnerSlides:[3,4,6,8,10],requiredNativeChartOwnerSlides:[],fontPolicy:{basis:'design',families:['Arial']},verifyArtifactToolImport:true,receiptPath:path.join(build,'validation.json')});
await fs.copyFile(validated,path.join(out,'Presentacion_RTI_EM.pptx'));
const lo=process.env.LIBREOFFICE_PATH||'C:\\Program Files\\LibreOffice\\program\\soffice.exe';
execFileSync(lo,[`-env:UserInstallation=${pathToFileURL(path.join(build,'lo-profile')).href}`,'--headless','--convert-to','pdf','--outdir',build,path.join(out,'Presentacion_RTI_EM.pptx')],{timeout:120000,stdio:'pipe',windowsHide:true});
await fs.copyFile(path.join(build,'Presentacion_RTI_EM.pdf'),path.join(out,'Presentacion_RTI_EM.pdf'));
console.log(JSON.stringify({slides:12,pptx:path.join(out,'Presentacion_RTI_EM.pptx'),pdf:path.join(out,'Presentacion_RTI_EM.pdf'),checks:path.join(build,'validation.json')}));
