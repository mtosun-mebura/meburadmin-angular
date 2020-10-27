import {Injectable} from '@angular/core';
import htmlToPdfmake from 'html-to-pdfmake';

@Injectable({
  providedIn: 'root'
})

export class PdfService {

  pdfMake: any;

  constructor() { }

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  async generatePdf(html) {

    await this.loadPdfMaker();

    const content = { content: [html
        // ,
        // {
        //   layout: 'lightHorizontalLines', // optional
        //   table: {
        //     // headers are automatically repeated if the table spans over multiple pages
        //     // you can declare how many rows should be treated as headers
        //     headerRows: 1,
        //     widths: [ '*', 'auto', 100, '*' ],
        //
        //     // body: [
        //     //   [ 'First', 'Second', 'Third', 'The last one' ],
        //     //   [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
        //     //   [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
        //     // ]
        //   }
        // }
        ]
    };

    // var html = htmlToPdfmake(`
    //   <div style="margin-top:20px; text-align: right">
    //     <img width="166" style="height:28px" src="data:image/png;base64,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" alt="Mebura">
    //   </div>`
    //   , {window:window, tableAutoSize:true});


//var html = htmlToPdfMake(``, {window:window, tableAutoSize:true});
//console.log(JSON.stringify(html))

    var html2 = htmlToPdfmake(`
  Simple text
  <div>
    <h1>Title Level 1</h1>
    <h2 style="color:green;margin-bottom:10px">Title Level 2</h2>
    <h3>Title Level 3</h3>
    <h4>Title Level 4</h4>
    <h5>Title Level 5</h5>
    <h6>Title Level 6</h6>
  </div>
  <p>
    This is a sentence with a <strong>bold and purple word</strong>, <em>one in italic</em>, and <u>one with underline</u>. And finally <a href="https://somewhere">a link</a>.
  </p>
  <span style="color:orange;font-weight:bold;margin:10px 5px">An orange bold span with margins.</span>
  <p>
    Below is a unordered list:
    <ul>
      <li>First item</li>
      <li>Second item</li>
      <li>
        With a sub unordered list:
        <ul>
          <li>Sub First <b>bolded</b> item</li>
          <li>Sub Second <u>underlined</u> item</li>
          <li>With a sub sub unordered list:
            <ul style="background-color:yellow">
              <li>Sub Sub First item</li>
              <li>Sub Sub Second item</li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        With a sub order list:
        <ol>
          <li>Sub Item 1</li>
          <li>Sub Item 2</li>
          <li>With a sub sub ordered list
            <ol>
              <li>Sub Sub Item 1</li>
              <li>Sub Sub Item 2</li>
            </ol>
        </ol>
      </li>
    </ul>
    <br>This sentence is surrended by BR<br>
  </p>
  <p>
    A first level ordered list:
    <ol>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ol>
  </p>
  <div>
    <p class="bold">
      Text in bold.
      <span class="red">This is a red span</span>
    </p>
  </div>
  <span>&lt;HR&gt; with the default style:</span>
  <hr>
  <span>Below, another &lt;HR&gt; but with different style: left=120, width=300, color='red', margin=[0,20,0,20], thickness=2</span>
  <hr data-pdfmake="{&quot;left&quot;:120, &quot;width&quot;:300, &quot;color&quot;:&quot;red&quot;, &quot;margin&quot;:[0,20,0,20], &quot;thickness&quot;:2}">
  <table class="pdf-pagebreak-before">
    <thead>
      <tr>
        <th>Region</th>
        <th>Result Q1</th>
        <th>Result Q2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Americas</th>
        <td>+3%</td>
        <td>+6%</td>
      </tr>
      <tr>
        <th>Europe</th>
        <td>+3.9%</td>
        <td>+5%</td>
      </tr>
      <tr>
        <th>Asia</th>
        <td>+1.5%</td>
        <td>+0.9%</td>
      </tr>
    </tbody>
  </table>
  <table>
    <tr>
      <th>Header Column 1</th>
      <th>Header Column 2</th>
    </tr>
    <tr>
      <td>Value Column 1</td>
      <td>Value Column 2</td>
    </tr>
  </table>
  <table>
    <tr>
      <th>Col A</th>
      <th>Col B</th>
      <th>Col C</th>
      <th>Col D</th>
    </tr>
    <tr>
      <td>Cell A1</td>
      <td rowspan="2">
        Cell B1 & B2
      </td>
      <td>Cell C1</td>
      <td rowspan="2">
        Cell D1 & D2
      </td>
    </tr>
    <tr>
      <td>Cell A2</td>
      <td>Cell C2</td>
    </tr>
    <tr>
      <td>Cell A3</td>
      <td colspan="2">Cell B3 & C3</td>
      <td>Cell D3</td>
    </tr>
    <tr>
      <td rowspan="2" colspan="3">
        Cell A4 & A5 & B4 & B5 & C4 & C5
      </td>
      <td>Cell D4</td>
    </tr>
    <tr>
      <td>Cell D5</td>
    </tr>
  </table>
  <table data-pdfmake="{&quot;widths&quot;:[100,&quot;*&quot;,&quot;auto&quot;],&quot;heights&quot;:40}">
    <tr>
      <td colspan="3">Table with <b>widths=[100,"*","auto"]</b> and <b>heights=40</b> using "data-pdfmake" attribute</th>
    </tr>
    <tr>
      <td>Cell1</td>
      <td style="text-align:center">Cell2</td>
      <td style="text-align:right">Cell3</td>
    </tr>
  </table>
  <table>
    <tr>
      <td style="background-color:red">Cell with red background</td>
      <td>Cell</td>
      <td style="border:1px solid red">Cell with red borders</td>
    </tr>
  </table>
  <p>Table autosized based on style "height" and "width" using "tableAutoSize:true" option:</p>
  <table>
    <tr style="height:100px">
      <td style="width:250px">height:100px / width:250px</td>
      <td>height:100px / width:'auto'</td>
    </tr>
    <tr>
      <td style="width:100px">Here "&lt;td width="100"&gt;" will use 250px for the width because we have to use the largest col's width</td>
      <td style="height:200px">height:200px / width:'auto'</td>
    </tr>
  </table>
  <p>Change the table's layout (header with red border, body with blue border):</p>
  <table data-pdfmake="{&quot;layout&quot;:&quot;exampleLayout&quot;}">
    <tr>
      <th>Header A</th>
      <th>Header B</td>
    </tr>
    <tr>
      <td>A1</td>
      <td>B1</td>
    </tr>
    <tr>
      <td>A2</td>
      <td>B2</td>
    </tr>
    <tr>
      <td>A3</td>
      <td>B3</td>
    </tr>
  </table>
  <svg version="1.1" baseProfile="full" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="red" />
    <circle cx="150" cy="100" r="80" fill="green" />
  </svg>
  <div style="margin-top:20px">
    An image: <img width="54" style="height:70px" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/7QPQUGhvdG9zaG9wIDMuMAA4QklNA+kKUHJpbnQgSW5mbwAAAAB4AAMAAABIAEgAAAAAAtgCKP/h/+IC+QJGA0cFKAP8AAIAAABIAEgAAAAAAtgCKAABAAAAZAAAAAEAAwMDAAAAAScPAAEAAQAAAAAAAAAAAAAAAGAIABkBkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOEJJTQPtClJlc29sdXRpb24AAAAAEAEsAAAAAQABASwAAAABAAE4QklNBA0YRlggR2xvYmFsIExpZ2h0aW5nIEFuZ2xlAAAAAAQAAAAeOEJJTQQZEkZYIEdsb2JhbCBBbHRpdHVkZQAAAAAEAAAAHjhCSU0D8wtQcmludCBGbGFncwAAAAkAAAAAAAAAAAEAOEJJTQQKDkNvcHlyaWdodCBGbGFnAAAAAAEAADhCSU0nEBRKYXBhbmVzZSBQcmludCBGbGFncwAAAAAKAAEAAAAAAAAAAjhCSU0D9RdDb2xvciBIYWxmdG9uZSBTZXR0aW5ncwAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gXQ29sb3IgVHJhbnNmZXIgU2V0dGluZ3MAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0ECAZHdWlkZXMAAAAAEAAAAAEAAAJAAAACQAAAAAA4QklNBB4NVVJMIG92ZXJyaWRlcwAAAAQAAAAAOEJJTQQaBlNsaWNlcwAAAABtAAAABgAAAAAAAAAAAAALiAAACMMAAAAGADYAMgAuADYAOAA0AAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAjDAAALiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4QklNBBQXTGF5ZXIgSUQgR2VuZXJhdG9yIEJhc2UAAAAEAAAAAThCSU0EIRpWZXJzaW9uIGNvbXBhdGliaWxp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">
  </div>
  <p style="text-align: center;"> <span style="font-size: 14px;"><em><strong>Bold italic centered text</strong></em></span> </p>
  <span class="a">text "bold" <span class="b">text "bold & italic" <span class="c">text "bold & italic & red"</span> text "bold & italic"</span> text "bold"</span>
  <div style="margin-top:20px">
    Below we preserve the spaces:
    <p class="with-spaces">     this    is     just     an     example.</p>
  </div>
  <div>And support for <font color="blue" size="3">FONT</font> tag.</div>
`, {window:window, tableAutoSize:true});

    var docDefinition = {
      footer: {
        stack: [
          {text: 'Opmerkingen & Voorwaarden', bold: true, fontSize: 8, alignment: 'right'},
          {text: 'Het vriendelijk verzoek om het bedrag binnen 14 dagen over te maken onder vermelding van factuurnummer', fontSize: 8, alignment: 'right'},
        ],
        margin: [35,0]
      },
      content: [
        html
      ],
      pageBreakBefore: function(currentNode) {
        // we add a page break before TABLE with the classname "pdf-pagebreak-before"
        return currentNode.table && currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1;
      },
      pageMargins: [40, 40, 40, 60],
      styles:{
        red:{
          color:'red'
        },
        blue:{
          color:'blue'
        },
        bold:{
          bold:true
        },
        'html-h6':{
          color:'purple'
        },
        'html-strong':{
          color:'purple'
        },
        'a':{
          bold:true
        },
        'b':{
          italics: true
        },
        'c':{
          color:'red',
          italics: false
        },
        'with-spaces':{
          preserveLeadingSpaces: true
        }
      }
    };

    this.pdfMake.createPdf(docDefinition).open();
  }

}
