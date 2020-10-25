// export class DayModel {
//     ShiftAssignmentID: number;
//     RequestStructureID: number;
//     RequestStructureStatus: number;
//     StructureID: number;// this.structur[m].id,
//     StructureTitle: string;// this.structur[m].title,
//     StructureAcronym: string;// this.structur[m].title,
//     CategoryStructureID: number;// this.structur[m].categoryid,
//     CategoryStructureTitle: string;//this.structur[m].categorytitle,
//     CategoryStructureAcronym: string;// this.structur[m].categorytitle,
//     FinalStructureID: number;//
//     FinalStructureTitle: string;//
//     FinalStructureAcronym: string;// ,
//     KayStyle: string;
//     Karkard: number;
//     DayStyle: string;

//     // constructor(ShiftAssignmentID: number,
//     //     RequestStructureID: number,
//     //     RequestStructureStatus: number,
//     //     StructureID: number,
//     //     StructureTitle: string,
//     //     StructureAcronym: string,
//     //     CategoryStructureID: number,
//     //     CategoryStructureTitle: string,
//     //     CategoryStructureAcronym: string,
//     //     FinalStructureID: number,
//     //     FinalStructureTitle: string,
//     //     FinalStructureAcronym: string,
//     //     KayStyle: string,
//     //     Karkard: number,
//     //     DayStyle: string) {
//     //         ShiftAssignmentID = this.ShiftAssignmentID;
//     //         RequestStructureID = this.RequestStructureID;
//     //         RequestStructureStatus = this.RequestStructureStatus;
//     //         StructureID = this.StructureID
//     //         StructureTitle = this.StructureTitle
//     //         StructureAcronym = this.StructureAcronym
//     //         CategoryStructureID = this.CategoryStructureID
//     //         CategoryStructureTitle = this.CategoryStructureTitle
//     //         CategoryStructureAcronym = this.CategoryStructureAcronym
//     //         FinalStructureID = this.FinalStructureID
//     //         FinalStructureTitle = this.FinalStructureTitle
//     //         FinalStructureAcronym = this.FinalStructureAcronym
//     //         KayStyle = this.KayStyle
//     //         Karkard = this.Karkard
//     //         DayStyle = this.DayStyle
//     // }
// }

export class DayModel{
    Date:string;
    DayNo:string;
    DayStyle:string;
    DayTitle:string;
    IsEditable:boolean;
    Movazafi:number;
    PackID:number;
    PersonID:number;
    PersonType:string;
    SpecialItems:any = [];
    Structures:any = [];
    isHoliday:boolean = false;
}