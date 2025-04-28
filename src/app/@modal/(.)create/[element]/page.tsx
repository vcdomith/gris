import EmptyMessage from "@/components/EmptyMessage/EmptyMessage"
import Modal from "@/components/Modal/Modal"
import NewElementForm from "@/components/NewElementForm/NewElementForm"

const VALID_ELEMENTS = ['group', 'playlist']

type Params = Promise<{ element: string }>
export default async function CreateElement({ params }: { params: Params }) {

    const { element } = await params

    if(!VALID_ELEMENTS.includes(element)) {
        return <div>
            <EmptyMessage message={`Método ${element} invalido!`}/>
        </div>
    }

    return (
        <Modal>
            <NewElementForm 
                element={element as ('group' | 'playlist')} 
            />
        </Modal>
    )

}